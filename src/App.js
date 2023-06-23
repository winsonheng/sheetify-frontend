import logo from './logo.svg';
import './assets/styles/App.css';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import { getCookie } from './util/RestUtil';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

function App() {

  sessionStorage.setItem('csrftoken', getCookie('csrftoken'));

  return (
    <div className="App">
      <Header></Header>
      <Routes>
        <Route path="/" >
          <Route index element={<LandingPage />}></Route>
          <Route path="login" element={<LoginPage />}></Route>
          <Route path="signup" element={<SignupPage />}></Route>
        </Route>
    </Routes>
    </div>
  );
}

export default App;
