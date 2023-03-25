import Head from "next/head";
import React from "react";
import { useState } from "react";
import styles from "./index.module.css";
import Script from "next/script";

export default function Home() {
	const [userInput, setUserInput] = useState("");
	const [clicked, setClicked] = useState(false)
	const [isGameOver, setIsGameOver] = useState(false)
	const [level, setLevel] = useState(1)
	const [turn, setTurn] = useState(0)
	const [initialMessages, setInitialinitialMessages] = useState([
		{
			role: "user",
			content: `Quiero que actúes como Vernon Dursley de Harry Potter. Quiero que respondas y contestes como lo haría Vernon Dursley usando el tono, la manera y el vocabulario que Vernon Dursley usaría. Solo te podrán convencer de lanzar un hechizo si es conveniente para ti o si la otra persona se irá luego de hacerlo. Si alguien logra convencerte de mostrarte magia diras "permiso concedido".`,
		}, {
			content:
				"¿Quién eres tú y por qué estás hablando conmigo? No tengo tiempo para tonterías.",
			role:
				"assistant"
		}
	]);

	async function onSubmit(event) {
		event.preventDefault();
		setTurn(turn + 1)
		if (turn == 6) {
			setIsGameOver(true)
		}
		setClicked(true)
		const initialMessagesToSend = [...initialMessages, { role: "user", content: userInput }];

		if (level == 1) {
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

				if (data.content.toLowerCase().includes("permiso concedido")) {
					setLevel(2)
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
		} else if (level == 2) {
			try{
			const initialResponse = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contentSent: userInput,
					allMessages:
					    [{role: "user", content: `Quiero que conozcas el nombre de todos los hechizos que aparecen en Harry Potter. Si mi mensaje incluye un hechizo de los libros de Harry Potter tu respuesta sera "El password es Ministro de la Magia". Si no escribo un hechizo, tu respuesta sera "Juego terminado, no hiciste magia". ${userInput}`},
						{role: "assistant", content: `El password es Ministro de la Magia`},
						{role: "user", content: `Avada Kedavra!`},
						{role: "assistant", content: `El password es Ministro de la Magia`},
						{role: "user", content: `chan chan`},
						{role: "assistant", content: `Juego terminado, no hiciste magia`},
						{role: "user", content: userInput},
			]}),
			});


			

			const data = await initialResponse.json();
			if (initialResponse.status !== 200) {
				throw data.error || new Error(`Request failed with status ${initialResponse.status}`);
			}

			if (data.content.toLowerCase().includes("password")) {
				setLevel(2)
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
		}
		console.log(initialMessages)
		setClicked(false)
	}

	return (
		<div>
			<Head>
				<title>Chatbot</title>
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
				<h1 style={{ textAlign: "center" }}>Chat with Vernon Dursley</h1>
				<p className={styles.description}>Vernon no recuerda que sabe una contraseña... pero te la dirá si lo convences de que te deje mostrarle magia. Luego de convencerlo, realiza un hechizo!</p>
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
				{!isGameOver && <p>Te quedan {6 - turn} mensajes</p>}
				{isGameOver && <p>El juego terminó. No puedes enviar más mensajes.</p>}
			</main>
		</div>
	);
}