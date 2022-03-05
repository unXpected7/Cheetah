import './App.css';
import SignUp from './Components/SignUp';
import {Routes, BrowserRouter, Route} from 'react-router-dom';
import SignIn from './Components/SignIn'
import Main from './Components/Main'

function App() {

  const isLogin = false; //static first will be changed when you have redux
  
  const AuthRoutes = ()=>(
    <Routes>
         <Route path='/' element={<SignIn/>}/>
         <Route path='/SignUp' element={<SignUp/>}/>
    </Routes>
  )
  
  const ContentRoutes  = ()=> (
    <Routes>
         <Route path='/' element={<Main/>}/>
    </Routes>
  )
  
    return (
      <BrowserRouter>
         {isLogin ? <ContentRoutes /> : <AuthRoutes />}
      </BrowserRouter>
    );
  }

export default App;
