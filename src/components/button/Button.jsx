import { Link } from "react-router-dom";

import styles from './Button.module.css'


export default function Button({to, text, background, color, onClick}) {
  return (
    <>
        {to ? <Link className={styles.btn} to={to} style={{ backgroundColor: background, color: color }}>{text}</Link> : 
        
        <button className={styles.btn} style={{ backgroundColor: background, color: color }} onClick={onClick}>{text}</button>}    
    </>
  )
}
