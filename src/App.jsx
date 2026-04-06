import  { BrowserRouter, Routes, Route, useNavigate} from './../node_modules/react-router-dom'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import ProtectedRoute from './components/protectedRoute/ProtectedRoute'
import Dashboard from './pages/dashboard/Dashboard'
import { AuthProvider } from './context/AuthContext'
import Transactions from './pages/transactions/Transactions'
import Transaction from './pages/transaction/Transaction'

function App() {

  return ( 
     <AuthProvider>
      <BrowserRouter>
        <Navbar/>
       
          <Routes>
            <Route path='/projetofinancas' element={<Home/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route 
              path='/login' 
              element={<Login/>}
            />

            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>    
              }/>

              <Route path='/transactions' element={
              <ProtectedRoute>
                <Transactions/>
              </ProtectedRoute>    
              }/>

               <Route path='/transaction/:id' element={
              <ProtectedRoute>
                <Transaction/>
              </ProtectedRoute>    
              }/>

          </Routes>
          
        <Footer/>
      </BrowserRouter> 
    </AuthProvider>
    
  )
}

export default App
