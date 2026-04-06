import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../../services/api";

import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext);

  async function handleLogout(){
    try{ 
      await api.post('/logout.php')
      logout(); // useContext
      navigate('/projetofinancas')
      
    }catch(error){
        console.error("Erro ao fazer logout", error)
    }

}

  return (
    <header className={styles.navbar}>
      <nav>
        
        <Link className={styles.logo} to="/projetofinancas">
          <img src="/projetofinancas/logo.png" alt="Logo do site" />
        </Link>
          
        {!user && (
          <>
            <Link className={styles.link} to="/projetofinancas">Início</Link>
            <Link className={styles.link} to="/signup">Cadastre-se</Link>
            <Link className={styles.link} to="/login">Entre</Link>   
          </>
        )}

        {user && (
          <button className={styles.link_sair} onClick={handleLogout}>
             Sair
          </button>
        )}

      </nav>
    </header>
  )}  
