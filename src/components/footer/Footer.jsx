import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaWhatsappSquare } from "react-icons/fa";

import { Link } from "react-router-dom";

import styles from './Footer.module.css'


export default function Footer() {
  
  // Ano atual automático
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.footer_container}> 
          <p className={styles.copy}>
          <strong>Desenvolvido por Elaine Tavares</strong> © {year}
        </p>  
        <div className={styles.main_session_social}>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/elainetavaresweb/" target='_blank' rel="noopener noreferrer"><FaLinkedin className={styles.linkedin}/></a>

            {/* Instagram */}
            <a href="https://www.instagram.com/elainetavares2026/" target='_blank' rel="noopener noreferrer"><FaInstagramSquare className={styles.instagram}/></a>

            {/* GitHub */}
            <a href="https://github.com/Elaine-Tavares" target='_blank' rel="noopener noreferrer"><FaGithub className={styles.github}/></a>

            {/* Whats */}
            <a href="https://wa.link/307ehj" target='_blank' rel="noopener noreferrer"><FaWhatsappSquare className={styles.whats}/></a>
        </div>    
        <Link to="/projetofinancas">
          <img src='/projetofinancas/logo.png' alt="Logo do site" className={styles.logo}/>
        </Link>     
      </div>      
    </footer>
  );
}
