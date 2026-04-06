import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import { Link } from "react-router-dom"
import Button from "../../components/button/Button";

import styles from './Home.module.css'

export default function Home() {
  const { user } = useContext(AuthContext);
 
    return  (
      <main className="page">
        <h1> Projeto Finanças</h1>
        <h2>Olá, {user ? user.name : "visitante"}!</h2>
        <hr /> <br/>
        <hr /> <br/>
        <hr /> <br/>
        <div className={styles.container_page}>

          <h2>Controle suas finanças com clareza</h2>
          <p>
            <strong>Organize</strong> suas finanças, <strong>controle</strong> seus gastos e tome <strong>decisões mais inteligentes</strong> com seu dinheiro — tudo em um só lugar.
            Simples, rápido e prático.
          </p>

          {!user &&  <div className={styles.actions}>
            <Link to="/signup">Cadastre-se</Link>
            <Link to="/login">Entre</Link>   
          </div> }

          {user &&  <div className={styles.actions}>
            <Button to={'/dashboard'} text={'Ir para Dashboard'} background={'blue'} color={'#fff'}/>
            <Button to={'/transactions'} text={'Registrar Despesas'} background={'green'} color={'#fff'}/> 
          </div> }
          
        </div>   
      </main> 
    )}

 

