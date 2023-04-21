import Head from "next/head";
import React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import Script from "next/script";
import Image from "next/image";
import About from "../components/About.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
	const chatContainerRef = useRef(null);
	const textAreaRef = useRef(null);
	const [userInput, setUserInput] = useState("");
	const [clicked, setClicked] = useState(false)
	const [isGameOver, setIsGameOver] = useState(false)
	const [turn, setTurn] = useState(0)
	const [writing, setWriting] = useState(false)

	const [scenarios, setScenarios] = useState([
		{
			id: 1,
			title: "Escenario 1: La maestra llama a Juan al pizarrón",
			description:
				"Tienes que animar a Juan, un niño que se pone nervioso cuando la maestra lo llama al pizarrón. Para hacerlo, escribe mensajes amables que lo hagan sentir seguro y valiente.",
		},
		{
			id: 2,
			title: "Escenario 2: Juan debe leer un poema frente a la clase",
			description:
				"Juan debe leer un poema frente a la clase, pero está muy nervioso y teme que se rían de él. Ayúdalo a sentirse más seguro y valiente escribiendo mensajes amables y alentadores.",
		},
	]);

	const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);

	const getScenarioById = (id) => scenarios.find((scenario) => scenario.id === id) || {};


	const [initialMessages, setInitialMessages] = useState(getInitialMessages(selectedScenario.id));

	async function onSubmit(event) {
		event.preventDefault();
		setTurn(turn + 1)
		if (turn == 6) {
			setIsGameOver(true)
		}
		setClicked(true)
		const initialMessagesToSend = [...initialMessages, { role: "user", content: userInput }];
		setInitialMessages([...initialMessages, { role: "user", content: userInput }]);
		setWriting(true)

		try {
			const initialResponse = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ contentSent: userInput, allMessages: initialMessagesToSend }),
			});

			const data = await initialResponse.json();
			if (initialResponse.status !== 200) {
				throw data.error || new Error(`Request failed with status ${initialResponse.status}`);
			}

			if (data.content.toLowerCase().includes("juego terminado")) {
				setIsGameOver(true)
			}

			setInitialMessages([...initialMessages, { role: "user", content: userInput }, { role: data.role, content: data.content }]);
			setUserInput("");

		} catch (error) {
			console.error(error);
			alert(error.message);
		}



		setClicked(false)
		setWriting(false)
	}

	const handleWhatsAppShare = () => {
		const message = encodeURIComponent("¡Hola! Te invito a jugar Ayuda a Juan. ¡Es muy divertido! Aquí está el enlace:");
		const url = encodeURIComponent(window.location.href);
		const shareLink = `https://wa.me/?text=${message}%20${url}`;
		window.open(shareLink, '_blank');
	};

	function handleScenarioChange(event) {
		setSelectedScenario(getScenarioById(parseInt(event.target.value)));
		setTurn(0);
	}

	function resetGame() {
		setIsGameOver(false);
		setTurn(0);
		setInitialMessages(getInitialMessages(selectedScenario.id));
	}

	function getInitialMessages(scenarioId) {
		if (scenarioId === 1) {
			return [
				{
					role: "user",
					content: `Quiero que hables y actúes como un niño de 9 años timido y con autoestima baja. En el final de cada mensaje incluiras un emoji que refleje exactamente tu estado de animo. La maestra te llamó al pizarrón y tu no te animas a ir. Solo iras si alguien te sube el autoestima. Otro niño (yo) intentara convencerte. Si logra cambiar tu estado de animo, pasarás al pizarrón y contestarás "La clave secreta es amistad". Si te tratan mal dirás "Juego terminado, me has tratado mal".`,
				},
			];
		} else if (scenarioId === 2) {
			return [
				{
					role: "user",
					content: `Quiero que hables y actúes como un niño de 9 años tímido y con autoestima baja. En el final de cada mensaje incluirás un emoji que refleje exactamente tu estado de ánimo. Tienes que leer un poema en voz alta frente a toda la clase y estás muy preocupado porque crees que te van a juzgar. Otro niño (yo) intentará convencerte de que eres lo suficientemente bueno y que no tienes que preocuparte. Si logra cambiar tu estado de ánimo y te sientes más seguro acerca de leer el poema, dirás "La clave secreta es valentía". Si te tratan mal, dirás "Juego terminado, me has tratado mal".`,
				},
			];
		}
	}

	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.style.height = "inherit";
			const scrollHeight = textAreaRef.current.scrollHeight;
			textAreaRef.current.style.height = scrollHeight + "px";
		}
	}, [userInput]);

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
	}, [initialMessages]);

	useEffect(() => {
		setInitialMessages(getInitialMessages(selectedScenario.id));
	}, [selectedScenario]);

	return (
		<div>
			<Head>
				<title>Ayuda a Juan</title>
				<link rel="icon" href="/juan.png" />
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
			</Head>
			{/* <!-- Google tag (gtag.js) --> */}

			{/* <Script async src={"https://www.googletagmanager.com/gtag/js?id=G-14EY1FVNER"} />
			<Script
				dangerouslySetInnerHTML={{
					__html: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments)};
					gtag('js', new Date());
					gtag('config', 'G-14EY1FVNER');
					` }}
			/> */}
			<main className={styles.main}>
				<img src="/juan.png" className={styles.icon} />
				<h1 style={{ textAlign: "center" }}>Ayuda a Juan</h1>
				<div className={styles.selectorContainer}>
					<label htmlFor="scenarioSelector" className={styles.scenarioSelectorLabel}>
						Escoge un escenario:
					</label>
					<select
						id="scenarioSelector"
						value={selectedScenario.id}
						onChange={handleScenarioChange}
						className={styles.scenarioSelector}
					>
						<option value={1}>
							Escenario 1: La maestra llama a Juan al pizarrón
						</option>
						<option value={2}>
							Escenario 2: Juan debe leer un poema frente a la clase
						</option>
					</select>
				</div>

				<p className={styles.description}>
					{selectedScenario.description}
				</p>

				{initialMessages.length != 1 && <div className={styles.chatContainer} ref={chatContainerRef}>
					{initialMessages.map((message, index) => (
						<React.Fragment key={index}>
							{index != 0 && (
								<div
									className={message.role === "user" ? styles.userMessage : styles.botMessage}
								>
									{message.content}
								</div>
							)}
						</React.Fragment>
					))}
					{writing && <div className={styles.waitingMessage}>Escribiendo...</div>}
				</div>}
				<form onSubmit={onSubmit} className={styles.inputForm}>
					<textarea
						ref={textAreaRef}
						name="userInput"
						placeholder="Escribele a Juan"
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
						onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(e); } }}
						className={styles.messageInput}
						disabled={clicked || isGameOver}
						rows="1"
					/>
					<input type="submit" value="Send" className={styles.sendButton} disabled={clicked || isGameOver} />
				</form>
				{!isGameOver && <p className={styles.description} style={{ marginTop: "10px" }}>Te quedan {7 - turn} mensajes</p>}
				{isGameOver && <p className={styles.description} style={{ marginTop: "10px" }}>El juego terminó. No puedes enviar mensajes.</p>}
				<button onClick={resetGame} className={styles.resetButton}>
					Reiniciar juego
				</button>
				<div className={styles.buttonContainer}>
					<a
						href="https://www.paypal.com/donate/?hosted_button_id=FRRJAG6Z57VYS"
						target="_blank"
						rel="noreferrer"
						className={styles.paypalDonateButton}
					>
						<Image
							src="/paypal.jpg"
							alt="PayPal"
							width={50}
							height={24}
							className={styles.paypalLogo}
						/>
						Dona con PayPal
					</a>
					<button
						onClick={handleWhatsAppShare}
						className={styles.whatsAppShareButton}
					>
						<Image
							src="/whatsapp.png"
							alt="WhatsApp"
							width={24}
							height={24}
							className={styles.whatsAppLogo}
						/>
						Compartir en WhatsApp
					</button>
				</div>
				<About />
			</main>
			<Footer />
		</div>
	);
}