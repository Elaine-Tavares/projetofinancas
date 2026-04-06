import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import Button from '../../components/button/Button';
import api from '../../../services/api';

import styles from './Transaction.module.css'


export default function Transaction() {
  const { id } = useParams();
  const navigate = useNavigate()

  const [transactionType, setTransactionType] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [transactionDescription, setTransactionDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const [msgSuc, setMsgSuc] = useState("")
  const [msgErr, setMsgErr] = useState("")
 
  // OPTIONS
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
  ];

  // GET
  async function getTransaction() {
    try {
      const response = await api.get("/transactions.php", {
        params: { transaction_id: id }
      });

      if (response.data.success && response.data.data) {
        const data = response.data.data;

        setTransactionType(data.transaction_type || "");
        setTransactionCategory(data.transaction_category || "");
        setTransactionDescription(data.transaction_description || "");
        setTransactionAmount(data.transaction_amount || "");
        setTransactionDate(
          data.transaction_date
            ? data.transaction_date.split(" ")[0]
            : ""
        );
      } else {
        alert(response.data.message || "Erro ao carregar transação");
      }

    } catch (error) {
      console.error(error);
      alert("Erro ao buscar transação");
    }
  }

  useEffect(() => {
    if (id) getTransaction();
  }, [id]);

  // PUT (ATUALIZAR)
  async function handleSubmit(e) {
    e.preventDefault();
   

    try {
      const response = await api.put("/transactions.php", {
        transaction_id: id,
        transactionTypeFront: transactionType,
        transactionCategoryFront: transactionCategory,
        transactionDescriptionFront: transactionDescription,
        transactionAmountFront: transactionAmount,
        transactionDateFront: transactionDate
      });

      if (response.data.success) {
        setMsgSuc("Transação atualizada com sucesso!");
        setTimeout(() => {
           navigate("/dashboard")
        }, 3000);
       
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.error(error);
      setMsgErr("Erro ao atualizar transação");
  } }

  return (
    <div className='page'>
      {msgSuc && <p className={`${styles.msg_suc} animate__animated animate__rubberBand`}>{msgSuc}</p>}
      {msgErr && <p className={`${styles.msg_err} animate__animated animate__rubberBand`}>{msgErr}</p>}
      
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Tipo */}
        <div>
          <label>Tipo:</label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
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
          />
        </div>
        <Button text={'Salvar'} background={'green'} color={'#fff'} /> 
      </form>
    </div>
  );
}