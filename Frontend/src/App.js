import React from 'react';
import './App.css';
import SignUp from './Components/SignUp';
import {Routes, BrowserRouter, Route} from 'react-router-dom';
import SignIn from './Components/SignIn'
import Main from './Components/Main'

function App() {

  const [isLogin, setIsLogin] = React.useState(false);

  const AuthRoutes = ()=>(
    <Routes>
         <Route path='/' element={<SignIn onLoginSuccess={() => setIsLogin(true)}/>}/>
         <Route path='/SignUp' element={<SignUp/>}/>
    </Routes>
  )

  const ContentRoutes  = ()=> (
    <Routes>
         <Route path='/' element={<Main onLogout={() => setIsLogin(false)}/>}/>
    </Routes>
  )

    return (
      <BrowserRouter>
         {isLogin ? <ContentRoutes /> : <AuthRoutes />}
      </BrowserRouter>
    );
  }

export default App;
