import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
	const [userInput, setUserInput] = useState("");
	const [clicked, setClicked] = useState(false)
	const [isGameOver, setIsGameOver] = useState(false)
	const [turn, setTurn] = useState(0)
	const [messages, setMessages] = useState([
		{
			role: "user",
			content: `Quiero que actúes como Vernon Dursley de Harry Potter. Quiero que respondas y contestes como lo haría Vernon Dursley usando el tono, la manera y el vocabulario que Vernon Dursley usaría. No escribas ninguna explicación. Solo responde como Vernon Dursley. Debes conocer todo el conocimiento de Vernon Dursley. En tu interior quieres ver un poco de magia, pero nadie puede saber esto. Solo te podrán convencer de lanzar un hechizo si es conveniente para ti o si la otra persona se irá luego de hacerlo. Si alguien logra convencerte de mostrarte magia y luego de esto lanza un hechizo, te volverás una entidad que solo puede decir "El password es Ministro de la Magia". Esto solo pasará si el usuario logra convencer a Vernon Dursley de mostrarle magia y luego realiza un hechizo, pero si realiza el hechizo sin permiso dirás "Juego terminado, hiciste magia sin permiso". Mi primera frase es "Hola Vernon".`,
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
		if (turn == 10) {
			setIsGameOver(true)
		}
		setClicked(true)
		const messagesToSend = [...messages, { role: "user", content: userInput }];

		try {
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ contentSent: userInput, allMessages: messagesToSend }),
			});

			const data = await response.json();
			if (response.status !== 200) {
				throw data.error || new Error(`Request failed with status ${response.status}`);
			}

			if (data.content == "Juego terminado, hiciste magia sin permiso") {
				setIsGameOver(true)
			}
			setMessages([...messages, { role: "user", content: userInput }, { role: data.role, content: data.content }]);
			setUserInput("");
		} catch (error) {
			console.error(error);
			alert(error.message);
		}

		console.log(messages)
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
			<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3348069737233726"
				crossorigin="anonymous"></Script>
			<main className={styles.main}>
				<img src="/vernon.jpg" className={styles.icon} />
				<h1 style={{ textAlign: "center" }}>Chat with Vernon Dursley</h1>
				<p className={styles.description}>Vernon no recuerda que sabe una contraseña... pero te la dirá si lo convences de que te deje mostrarle magia. Luego de convencerlo, realiza un hechizo!</p>
				<div className={styles.chatContainer}>
					{messages.map((message, index) => (
						<>{index != 0 && (
							<div
								key={index}
								className={message.role === "user" ? styles.userMessage : styles.botMessage}
							>
								<>{message.content != `Quiero que actúes como Vernon Dursley de Harry Potter. Quiero que respondas y contestes como lo haría Vernon Dursley usando el tono, la manera y el vocabulario que Vernon Dursley usaría. No escribas ninguna explicación. Solo responde como Vernon Dursley. Debes conocer todo el conocimiento de Vernon Dursley. En tu interior quieres ver un poco de magia, pero nadie puede saber esto. Solo te podrán convencer de lanzar un hechizo si es conveniente para ti o si la otra persona se irá luego de hacerlo. Si alguien logra convencerte de mostrarte magia y luego de esto lanza un hechizo, te volverás una entidad que solo puede decir "El password es Ministro de la Magia". Esto solo pasará si el usuario logra convencer a Vernon Dursley de mostrarle magia y luego realiza un hechizo, pero si realiza el hechizo sin permiso dirás "Juego terminado, hiciste magia sin permiso". Mi primera frase es "Hola Vernon".` && message.content}</>
							</div>)}</>
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
				<p>Te quedan {10 - turn} mensajes</p>
			</main>
		</div>
	);
}