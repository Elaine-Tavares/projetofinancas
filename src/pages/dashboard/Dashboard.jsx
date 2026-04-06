import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../../services/api";

//Ícones para melhorar a experiência visual (UX)
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";

import Button from "../../components/button/Button";
import Loader from "../../components/loader/Loader";

import styles from "./Dashboard.module.css";

export default function Dashboard() {

  //useContext: acessa dados globais (nesse caso, o usuário logado)
  const { user } = useContext(AuthContext);

  //Estado que armazena todas as transações vindas da API
  const [transactions, setTransactions] = useState([]);

  //Estado de controle de carregamento (loading)
  const [loading, setLoading] = useState(true);

  //Função para formatar valores em moeda brasileira (R$)
  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // =========================
  // CÁLCULOS
  // =========================

  //totalIncome:
  // 1. filter → pega apenas transações do tipo "income"
  // 2. reduce → soma todos os valores dessas transações
  const totalIncome = transactions
    .filter((t) => t.transaction_type === "income")
    .reduce((acc, t) => acc + Number(t.transaction_amount), 0);

  //totalExpense:
  // mesmo processo, mas filtrando "expense"
  const totalExpense = transactions
    .filter((t) => t.transaction_type === "expense")
    .reduce((acc, t) => acc + Number(t.transaction_amount), 0);

  //balance:
  // saldo final = entradas - despesas
  const balance = totalIncome - totalExpense;

  // =========================
  // REQUISIÇÃO GET
  // =========================

  async function fetchTransactions() {
    try {
      //Faz requisição GET para a API
      //passando o userId como parâmetro
      const response = await api.get("/transactions.php", {
        params: { userId: user.id },
      });

      //Se a API retornar sucesso
      if (response.data.success) {
        //salva as transações no estado
        setTransactions(response.data.data);
      }

    } catch (error) {
      //Tratamento de erro
      console.error("Erro ao buscar transações:", error);

    } finally {
      //Esse bloco sempre executa (com erro ou sucesso)
      //usado para parar o loading
      setLoading(false);
    }
  }

  //useEffect:
  //executa a função assim que o componente carrega (mount)
  useEffect(() => {
    fetchTransactions();
  }, []);

  //Enquanto estiver carregando, mostra o Loader
  if (loading) return <Loader />;

  return (
    <main className={styles.container}>

      {/* =========================
          HEADER
         ========================= */}
      <header className={styles.header}>
        <div>
          <h1>Dashboard</h1>

          {/*Saudação dinâmica com nome do usuário */}
          <p>Bem-vindo(a) de volta, {user.name} 👋</p>
        </div>

        {/*Botão que redireciona para criação de transação */}
        <Button
          to="/transactions"
          text="+ Nova transação"
          background="green"
          color="#fff"
        />
      </header>

      {/* =========================
         CARDS (RESUMO)
         ========================= */}
      <section className={styles.summary}>

        {/*Card de entradas */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Entradas</span>

            {/*Ícone visual */}
            <FaArrowUp />
          </div>

          {/*Valor formatado */}
          <strong className={styles.income}>
            {formatCurrency(totalIncome)}
          </strong>
        </div>

        {/*Card de despesas */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Despesas</span>
            <FaArrowDown />
          </div>

          <strong className={styles.expense}>
            {formatCurrency(totalExpense)}
          </strong>
        </div>

        {/*Card de saldo */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Saldo</span>
            <FaWallet />
          </div>

          {/*Classe dinâmica:
              se saldo >= 0 → verde (income)
              se saldo < 0 → vermelho (expense)
          */}
          <strong
            className={
              balance >= 0 ? styles.income : styles.expense
            }
          >
            {formatCurrency(balance)}
          </strong>
        </div>
      </section>

      {/* =========================
          LISTA DE TRANSAÇÕES
         ========================= */}
      <section className={styles.transactions}>
        <h2>Últimas transações</h2>

        {/*Se não tiver transações */}
        {transactions.length === 0 ? (
          <p>Nenhuma transação encontrada.</p>

        ) : (
          <ul>

            {/*slice(0,5) → pega apenas as 5 primeiras transações */}
            {transactions.slice(0, 5).map((t) => (

              //key é obrigatório no React para listas
              <li key={t.id} className={styles.transactionItem}>
                <div>

                  {/*Descrição da transação */}
                  <strong>{t.description}</strong>

                  {/*Tipo da transação */}
                  <span>{t.transaction_type}</span>
                </div>

                {/*Valor com cor dinâmica */}
                <span
                  className={
                    t.transaction_type === "income"
                      ? styles.income
                      : styles.expense
                  }
                >
                  {formatCurrency(Number(t.transaction_amount))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}