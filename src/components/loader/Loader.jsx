import loading from "../../assets/loading.svg";

import styles from './Loader.module.css'

export default function Loader() {
  return (
    <div className={styles.loader}>
      <img src={loading} alt="loading" />
    </div>
  )
}
