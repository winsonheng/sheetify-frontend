import React, { Component } from 'react'
import { useLocation } from 'react-router-dom';
import '../assets/styles/LoginPage.css'

export default function LoginPage(props) {

  const location = useLocation();

  return (
    <div className='login-page'>
      LoginPage{location.state.email}
    </div>
  )
}
