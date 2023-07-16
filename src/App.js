import logo from './logo.svg';
import './assets/styles/App.css';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import { HttpMethod, StatusCode, getCookie, getCsrfToken, postData } from './util/RestUtil';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MySongs from './components/MySongs';
import { BACKEND_BASE_URL, PATH } from './constants/config';
import GlobalPlaylist from './components/GlobalPlaylist';
import Cookies from 'universal-cookie';
import { USERS_GET_CSRF } from './constants/endpoints';
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {}
});

function App() {

  useEffect(() => {
    const cookies = new Cookies();
    const csrftoken = cookies.get('csrftoken');
    if (typeof(csrftoken) === 'undefined' || csrftoken === null) {
      getCsrfToken();
    }
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('token') !== null);
  
  function handleLogin(user) {
    sessionStorage.setItem('token', user.token);
    sessionStorage.setItem('username', user.username);
    sessionStorage.setItem('lastLogin', user.lastLogin);
    setIsLoggedIn((prev) => {
      return true;
    })
  }

  return (
    <div className="App">
      <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <Header></Header>
      </UserContext.Provider>
      <Routes>
        <Route path={PATH.ROOT} >
          <Route index element={<LandingPage />}></Route>
          <Route path={PATH.LANDING_PAGE} element={<LandingPage />}></Route>
          <Route path={PATH.LOGIN_PAGE} element={<LoginPage handleLogin={handleLogin}/>}></Route>
          <Route path={PATH.SIGNUP_PAGE} element={<SignupPage />}></Route>
          <Route path={PATH.MY_SONGS} element={<MySongs />}></Route>
          <Route path={PATH.GLOBAL_PLAYLIST} element={<GlobalPlaylist />}></Route>
        </Route>
    </Routes>
    </div>
  );
}

export default App;
