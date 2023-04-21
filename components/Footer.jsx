import React from 'react'
import styles from "../pages/index.module.css";

const Footer = () => {
	return (
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
	)
}

export default Footer