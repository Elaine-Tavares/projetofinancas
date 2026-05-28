import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import Button from "../../components/button/Button";
import Loader from '../../components/loader/Loader';

import styles from './Home.module.css'
import api from "../../../services/api";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("visitante@financas.com")
  const [password, setPassword] = useState(123456)
  const [msgErr, setMsgErr] = useState("")
     
  const navigate = useNavigate()
  const { login } = useContext(AuthContext);
  //Estado de controle de carregamento (loading)
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e){
        e.preventDefault()
        // console.log(`Email: ${email}, Password: ${password}`)
        setLoading(true)
        let response = null;
        
        try {
            response = await api.post('/login.php', {
                email,
                password  
            })

            if(response.data.success){  
                login(response.data.user) 
                navigate('/dashboard')
                setEmail("")
                setPassword("")
                return;

            } else {
                setLoading(false)
                console.log(response.data.message)
                setMsgErr(response.data.message)

                setTimeout(() => {
                    setMsgErr("")
                }, 3000);
                return;
            }
 
        } catch (error) {
            setLoading(false)
            console.log("Erro ao conectar com o servidor. Tente novamente mais tarde.", error);
            setMsgErr(response.data.message)
            // apaga a mensagem de erro após 3s
            setTimeout(() => {
                setMsgErr("")
            }, 3000);
            return;
        }  
                   
    }
 
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

        <hr style={{marginTop: "30px"}}/> <br/>
        <hr /> <br/>
        <hr /> <br/>

        <div className={styles.container_form}>   
          <p>Experimente a versão DEMO

            Quer ver como é fácil organizar suas finanças de forma simples e prática?
            Acesse a versão demonstrativa e explore todas as funcionalidades. 

            Teste, clique, descubra e imagine como seria ter total controle do seu dinheiro no dia a dia.

            Entre agora e comece a experiência!
          </p>
          <form onSubmit={handleSubmit} className={styles.form}> 
            <h2>Demo</h2>
            {loading && <Loader/>}           
            <input 
              type="email" 
              placeholder='Email'
              value={email}           
            />
            <input 
              type="password" 
              placeholder='Password' 
              value={password}
            />       
            <button type='submit' className={styles.btn_form}>Entrar</button>
          </form>
        </div>
      </main> 
    )}

 

