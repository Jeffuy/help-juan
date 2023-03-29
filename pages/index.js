import Head from "next/head";
import React from "react";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import Script from "next/script";
import Image from "next/image";


export default function Home() {
	const [userInput, setUserInput] = useState("");
	const [clicked, setClicked] = useState(false)
	const [isGameOver, setIsGameOver] = useState(false)




	const [turn, setTurn] = useState(0)
	const [initialMessages, setInitialMessages] = useState([
		{
			role: "user",
			content: `Quiero que hables y actúes como un niño de 10 años muy timido y con autoestima muy baja. Solo contestaras con dialogos, sin acciones. Al final de cada mensaje, escribiras un emoji que relate tu estado de animo actual. La maestra te llamó al pizarrón y tu no te animas a ir. Solo te animaras si alguien te sube el autoestima. El usuario, que tambien sera un niño, intentara convencerte. Si logra cambiar tu estado de animo, accederás a pasar al pizarrón. En ese caso contestarás "La clave secreta es amistad". Si alguien te trata mal dirás "Juego terminado, me has tratado mal".`,
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


		console.log(initialMessages)
		setClicked(false)
	}

	const handleWhatsAppShare = () => {
		const message = encodeURIComponent("¡Hola! Te invito a jugar Ayuda a Juan. ¡Es muy divertido! Aquí está el enlace:");
		const url = encodeURIComponent(window.location.href);
		const shareLink = `https://wa.me/?text=${message}%20${url}`;
		window.open(shareLink, '_blank');
	};






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
				<p className={styles.description}>Juan es un niño muy tímido que no se anima a pasar al pizarrón cuando la maestra lo llama. Si le hablas para ayudarlo a confiar en si mismo, quizas se anime. Si logras convencerlo, te dará una clave secreta y ganarás el juego!</p>
				<div className={styles.chatContainer}>
					{initialMessages.map((message, index) => (
						<React.Fragment key={index}>{index != 0 && (
							<div

								className={message.role === "user" ? styles.userMessage : styles.botMessage}
							>
								{message.content}
							</div>)}</React.Fragment>
					))}
				</div>
				<form onSubmit={onSubmit} className={styles.inputForm}>
					<input
						type="text"
						name="userInput"
						placeholder="Type your message here"
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
						className={styles.messageInput}
						disabled={clicked || isGameOver}
					/>
					<input type="submit" value="Send" className={styles.sendButton} disabled={clicked || isGameOver} />
				</form>
				{!isGameOver && <p>Te quedan {7 - turn} mensajes</p>}
				{isGameOver && <p>El juego terminó. No puedes enviar mensajes.</p>}
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
			</main>
		</div>
	);
}