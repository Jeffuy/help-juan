import Head from "next/head";
import React from "react";
import { useState } from "react";
import styles from "./index.module.css";
import Script from "next/script";

export default function Home() {
	const [userInput, setUserInput] = useState("");
	const [clicked, setClicked] = useState(false)
	const [isGameOver, setIsGameOver] = useState(false)

	const [turn, setTurn] = useState(0)
	const [initialMessages, setInitialinitialMessages] = useState([
		{
			role: "user",
			content: `Quiero que actúes como un niño de 10 años muy timido y con autoestima muy baja. Hablaras y actuaras como si tuvieses 10 años. Solo contestaras con dialogos, sin acciones. Al final de cada mensaje, escribiras un emoji que relate tu estado de animo actual. La maestra te llamará al pizarrón y tu no te animas a ir. Solo te animaras si alguien te sube el autoestima. Para ellos deberás hablar con el usuario, que tambien sera un niño intentando convencerte. Si logran cambiar tu estado de animo, accederás a pasar al pizarrón. En ese caso contestarás "La clave secreta es amistad". Si alguien te trata mal dirás "Juego terminado, me has tratado mal". Mi primer mensaje es "Hola"`,
		}]);

	async function onSubmit(event) {
		event.preventDefault();
		setTurn(turn + 1)
		if (turn == 6) {
			setIsGameOver(true)
		}
		setClicked(true)
		const initialMessagesToSend = [...initialMessages, { role: "user", content: userInput }];

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

			setInitialinitialMessages([...initialMessages, { role: "user", content: userInput }, { role: data.role, content: data.content }]);
			setUserInput("");

		} catch (error) {
			console.error(error);
			alert(error.message);
		}


		console.log(initialMessages)
		setClicked(false)
	}

	return (
		<div>
			<Head>
				<title>Ayuda a Juan</title>
				<link rel="icon" href="/vernon.jpg" />
			</Head>
			{/* <!-- Google tag (gtag.js) --> */}

			<Script async src={`https://www.googletagmanager.com/gtag/js?id=G-C3DJWX5TE8`} />
			<Script
				dangerouslySetInnerHTML={{
					__html: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments)};
					gtag('js', new Date());
					gtag('config', 'G-C3DJWX5TE8');
					` }}
			/>
			<main className={styles.main}>
				<img src="/vernon.jpg" className={styles.icon} />
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
			</main>
		</div>
	);
}