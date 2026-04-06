import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from '../../../services/api'

import Loader from '../../components/loader/Loader';

import styles from './Login.module.css'

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
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

  return (
    <main className="page">
      <h1>Entre</h1>
      <form onSubmit={handleSubmit} className={styles.form}> 
        <div className={styles.container_msgs_to_user}>
            {loading && <Loader/>}
            {msgErr && <p className={`${styles.msg_err} animate__animated animate__rubberBand`}>{msgErr}</p>}
        </div>      
        <input 
            type="email" 
            placeholder='Email'
            value={email} 
            onChange={(e) => setEmail(e.target.value)              
            }
                
        />
        <input 
            type="password" 
            placeholder='Password' 
            value={password}
            onChange={(e) => setPassword(e.target.value)           
            }

        />       
        <button type='submit' className={styles.btn_form}>Entrar</button>
      </form>
    </main>
  )
}
