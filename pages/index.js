import Head from "next/head";
import React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import Script from "next/script";
import Image from "next/image";



export default function Home() {
	const textAreaRef = useRef(null);
	const [userInput, setUserInput] = useState("");
	const [clicked, setClicked] = useState(false)
	const [isGameOver, setIsGameOver] = useState(false)
	const [turn, setTurn] = useState(0)
	const [initialMessages, setInitialMessages] = useState([
		{
			role: "user",
			content: `Quiero que hables y actúes como un niño de 10 años timido y con autoestima baja. En el final de cada mensaje incluiras un emoji que refleje exactamente tu estado de animo. La maestra te llamó al pizarrón y tu no te animas a ir. Solo iras si alguien te sube el autoestima. Otro niño (yo) intentara convencerte. Si logra cambiar tu estado de animo, pasarás al pizarrón y contestarás "La clave secreta es amistad". Si te tratan mal dirás "Juego terminado, me has tratado mal".`
		}]);

	async function onSubmit(event) {
		event.preventDefault();
		setTurn(turn + 1)
		if (turn == 6) {
			setIsGameOver(true)
		}
		setClicked(true)
		const initialMessagesToSend = [...initialMessages, { role: "user", content: userInput }];
		setInitialMessages([...initialMessages, { role: "user", content: userInput }]);

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
	}

	const handleWhatsAppShare = () => {
		const message = encodeURIComponent("¡Hola! Te invito a jugar Ayuda a Juan. ¡Es muy divertido! Aquí está el enlace:");
		const url = encodeURIComponent(window.location.href);
		const shareLink = `https://wa.me/?text=${message}%20${url}`;
		window.open(shareLink, '_blank');
	};


	useEffect(() => {
		if (textAreaRef.current) {
			textAreaRef.current.style.height = "inherit";
			const scrollHeight = textAreaRef.current.scrollHeight;
			textAreaRef.current.style.height = scrollHeight + "px";
		}
	}, [userInput]);



	return (
		<div>
			<Head>
				<title>Ayuda a Juan</title>
				<link rel="icon" href="/juan.png" />
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
			</Head>
			{/* <!-- Google tag (gtag.js) --> */}

			<Script async src={"https://www.googletagmanager.com/gtag/js?id=G-14EY1FVNER"} />
			<Script
				dangerouslySetInnerHTML={{
					__html: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments)};
					gtag('js', new Date());
					gtag('config', 'G-14EY1FVNER');
					` }}
			/>
			<main className={styles.main}>
				<img src="/juan.png" className={styles.icon} />
				<h1 style={{ textAlign: "center" }}>Ayuda a Juan</h1>
				<p className={styles.description}>Juan es un niño tímido que se pone nervioso al pasar al pizarrón cuando la maestra lo llama. Si charlas con él y lo ayudas a sentirse seguro de sí mismo, tal vez se anime a ir. Si se anima, preguntale como le fue, ¡te compartirá una clave secreta y ganarás el juego!</p>
				{initialMessages.length != 1 && <div className={styles.chatContainer}>
					{initialMessages.length == 1 && <div className={styles.waitingMessage}>Juan esta esperando tu mensaje!</div>}
					{initialMessages.map((message, index) => (
						<React.Fragment key={index}>{index != 0 && (
							<div

								className={message.role === "user" ? styles.userMessage : styles.botMessage}
							>
								{message.content}
							</div>)}</React.Fragment>
					))}
				</div>}
				<form onSubmit={onSubmit} className={styles.inputForm}>
					<textarea
						ref={textAreaRef}
						name="userInput"
						placeholder="Escribele a Juan"
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
						className={styles.messageInput}
						disabled={clicked || isGameOver}
						rows="1"
					/>
					<input type="submit" value="Send" className={styles.sendButton} disabled={clicked || isGameOver} />
				</form>
				{!isGameOver && <p className={styles.description} style={{ marginTop: "10px" }}>Te quedan {7 - turn} mensajes</p>}
				{isGameOver && <p className={styles.description} style={{ marginTop: "10px" }}>El juego terminó. No puedes enviar mensajes.</p>}
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
				<section className={styles.aboutSection}>
					<h2>Acerca de Ayuda a Juan</h2>
					<p>
						Ayuda a Juan es una aplicación interactiva diseñada para ayudar al desarrollo de la empatía y habilidades socioemocionales a los niños en las aulas. La interacción con personajes como Juan acompaña a los niños mientras identifican emociones, comprenden perspectivas y desarrollan habilidades de comunicación asertivas en un entorno seguro y atractivo.
					</p>
					<p>
						El objetivo es ayudar a los niños a desarrollar empatía y confianza en sí mismos para enfrentar los desafíos de la vida y construir relaciones significativas y positivas. Espero que Ayuda a Juan sea el comienzo de un enriquecedor viaje de aprendizaje emocional.
					</p>
				</section>
			</main>
			<footer className={styles.footer}>
				<div className={styles.contactWrapper}>
					<p>Contáctame:</p>
					<ul className={styles.contactList}>
						<li>
							<a href="mailto:gcavaniuy@gmail.com" target="_blank" rel="noreferrer">
								<img src="/email.svg" alt="Linkedin" className={styles.logo} />
							</a>
						</li>
						<li>
							<a href="https://www.linkedin.com/in/german-c-b0b371218/" target="_blank" rel="noreferrer">
								<img src="/linkedin.svg" alt="Linkedin" className={styles.logo} />

							</a>
						</li>
						<li>
							<a href="https://github.com/Jeffuy" target="_blank" rel="noreferrer">
								<img src="/github.svg" alt="GitHub" className={styles.logo} />
							</a>
						</li>
						<li>
							<a href="https://www.gcavani.com/" target="_blank" rel="noreferrer">
								<img src="/website.svg" alt="Website" className={styles.logo} />
							</a>
						</li>
					</ul>
				</div>
				<div className={styles.copyright}>
					<p>&copy; {new Date().getFullYear()} Germán Cavani. Todos los derechos reservados.</p>
				</div>
			</footer>
		</div>
	);
}