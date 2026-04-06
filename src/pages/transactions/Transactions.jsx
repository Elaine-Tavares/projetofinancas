import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../../services/api";

import Button from "../../components/button/Button";
import Loader from "../../components/loader/Loader";

import styles from "./Transactions.module.css";

export default function Transactions() {
  const { user } = useContext(AuthContext);
  const [transactionType, setTransactionType] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [transactionDescription, setTransactionDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const [msgSuc, setMsgSuc] = useState("")
  const [msgErr, setMsgErr] = useState("")

  //Estado de controle de carregamento (loading)
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);


  // SALVAR DADOS DA API
  const [transactionsGet, setTransactionsGet] = useState([]);

 // OPTIONS (fixos)
  const transactionTypeOptions = [
    { id: 1, name: "income" },
    { id: 2, name: "expense" }
  ];

  const transactionCategoryOptions = [
    { id: 1, name: "Salário" },
    { id: 2, name: "Freelance" },
    { id: 3, name: "Alimentação" },
    { id: 4, name: "Transporte" },
    { id: 5, name: "Lazer" },
    { id: 6, name: "Moradia" },
    { id: 7, name: "Outros" }
  ]

  // GET
  async function getTransactions() {
    try {
      const response = await api.get("/transactions.php", {
        params: {
          userId: user.id
        }
      });

      if (response.data.success) {
        setTransactionsGet(response.data.data);
        console.log("GET REALIZADO COM SUCESSO")
        console.log("DATA", response.data.data)
        setLoading(false)

      } else {
        console.log(response.data.message);
        setLoading(false)
      }

    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      setLoading(false)
    }
  }


  // POST
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)

    try {
      let response = null;

        // CREATE 
        response = await api.post("/transactions.php", {
          userIdFront: user.id,
          transactionTypeFront: transactionType,
          transactionCategoryFront: transactionCategory,
          transactionDescriptionFront: transactionDescription,
          transactionAmountFront: transactionAmount,
          transactionDateFront: transactionDate
        });
      

      if (response.data.success) {
        setMsgSuc(response.data.message);

        setTimeout(() => setMsgSuc(""), 3000);

        // limpa tudo
        setTransactionType("");
        setTransactionCategory("");
        setTransactionDescription("");
        setTransactionAmount("");
        setTransactionDate("");
    
        getTransactions();
      }

    } catch (error) {
      setMsgErr("Erro ao salvar", error);
      setTimeout(() => setMsgErr(""), 3000);
      setLoading(false)
    }
  }

  // DELETE
  async function handleDelete(id) {
    setLoading(true)
  try {
    const response = await api.delete("/transactions.php", {
       data: {
        transaction_id: id
      }
    });

    if (response.data.success) {
      setMsgSuc(response.data.message);

      setTimeout(() => {
        setMsgSuc('');
      }, 3000);
      getTransactions(); // atualiza lista
    }

  } catch (error) {
    setMsgErr("Erro ao deletar a transação");
    console.error(error);

    setTimeout(() => {
        setMsgErr('');
      }, 3000);
  }
  }

useEffect(() => {
  if (user?.id) {
    getTransactions();
  }
}, [user]);

  return (
    <main className="page">
      
      {loading ? (<Loader/>) : (
      <>
        <h1>Registrar Transações de {user?.name}</h1>
        <Button to={'/dashboard'} text={'Ir para Dashboard'} background={'blue'} color={'#fff'}/>
      
        {/* FORM */}
        <form onSubmit={handleSubmit} className={styles.form}>

          {/* Tipo */}
          <div>
            <label>Tipo:</label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              required
            >
              <option value="">Selecione</option>

              {transactionTypeOptions.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label>Categoria:</label>
            <select
              value={transactionCategory}
              onChange={(e) => setTransactionCategory(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {transactionCategoryOptions.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Valor */}
          <div>
            <label>Valor:</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label>Descrição:</label>
            <input
              type="text"
              value={transactionDescription}
              onChange={(e) => setTransactionDescription(e.target.value)}
            />
          </div>

          {/* Data */}
          <div>
            <label>Data:</label>
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
          </div>

          <Button text={'Salvar'} background={'green'} color={'#fff'}/> 
        </form>

        {showConfirm && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
              <p>Tem certeza que deseja deletar essa transação?</p>
              <div className={styles.modalActions}>
                <button
                  className={styles.confirmBtn}
                  onClick={() => {
                    handleDelete(selectedId);
                    setShowConfirm(false);
                    }}
                  >
                  Deletar
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowConfirm(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LISTA DAS TRANSAÇÔES*/}
        <ul className={styles.list}>
          {msgSuc && <p className={`${styles.msg_suc} animate__animated animate__rubberBand`}>{msgSuc}</p>}
          {msgErr && <p className={`${styles.msg_err} animate__animated animate__rubberBand`}>{msgErr}</p>}

          {transactionsGet.map((t) => (
          <li key={t.transaction_id} className={styles.card}>
      
            <div className={styles.top}>
              <span className={`${styles.type} ${
                  t.transaction_type === "income"
                    ? styles.income
                    : styles.expense
                }`}>{t.transaction_type}</span>
              <span className={`${styles.amount} ${
                  t.transaction_type === "income"
                    ? styles.income
                    : styles.expense
                }`}>
                R$ {t.transaction_amount}
              </span>
            </div>

            <div className={styles.middle}>
              <span>Categoria: {t.transaction_category}</span>
              <span>Descrição: {t.transaction_description}</span>
              <span>Data: {t.transaction_date}</span>
            </div>

            <div className={styles.bottom}>
              <Button text={'Editar'} background={'blue'} color={"#fff"} to={`/transaction/${t.transaction_id}`}/>
              <Button text={'Deletar'} background={'red'} color={"#fff"} onClick={() =>{ setSelectedId(t.transaction_id);
              setShowConfirm(true);
              window.scrollTo({
                top: 200,
                behavior: "smooth"
              });
             }}/>         
            </div>
          </li>
         ))}
        </ul>    
      </>)}  
    </main>
  );
}