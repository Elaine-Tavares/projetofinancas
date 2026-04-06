import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Loader from '../../components/loader/Loader'
import api from '../../../services/api'

import styles from './Signup.module.css'

export default function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [checkTerms, setCheckTerms] = useState(false)
    const [msgSuc, setMsgSuc] = useState("")
    const [msgErr, setMsgErr] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        // console.log(`Nome: ${name}, Email: ${email}, Password: ${password}, Password Confirm: ${passwordConfirm}, Terms: ${checkTerms}`)

        let response = null;
        setLoading(true)

        try {
            response = await api.post('/signup.php', {
                name,
                email,
                password,
                passwordConfirm,
                terms: checkTerms ? 1 : 0
            })

            if(response.data.success){
                setLoading(false)
                setMsgSuc(response.data.message)   
                    setName("")
                    setEmail("")
                    setPassword("")
                    setPasswordConfirm("")
                    setCheckTerms(false)
                
                setTimeout(() => {
                    setMsgSuc("")
                    navigate('/login')
                }, 3000);    

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
            setMsgErr("Erro ao conectar com o servidor. Tente novamente mais tarde.", error)
            // apaga a mensagem de erro após 3s
            setTimeout(() => {
                setMsgErr("")
            }, 3000);
            return;
        }
    }

  return (
    <main className="page">
      <h1>Cadastre-se</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.container_msgs_to_user}>
          {loading && <Loader/>}
          {msgErr && <p className={`${styles.msg_err} animate__animated animate__rubberBand`}>{msgErr}</p>}
          {msgSuc && <p className={`${styles.msg_suc} animate__animated animate__rubberBand`}>{msgSuc}</p>}
        </div>
        <input 
          type="text" 
          placeholder='Name'
          value={name} 
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="email" 
          placeholder='Email'
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder='Password' 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input 
          type="password" 
          placeholder='Password Confirm' 
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <div className={styles.checkbox_group}>
          <input 
          type="checkbox" 
          id='terms'
          checked={checkTerms}
          onChange={(e) => setCheckTerms(e.target.checked)}
          />
          <label htmlFor="terms">
            Ao se cadastrar, você concorda com os <Link>Termos de Uso</Link> e a <Link>Política de Privacidade</Link>
          </label>
        </div>      
        <button type='submit' className={styles.btn_form}>Cadastrar</button>
      </form>
    </main>
  )
}
