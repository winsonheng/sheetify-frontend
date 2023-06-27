import React, { Component } from 'react'
import logo from '../assets/images/logo.png'
import "../assets/styles/Header.css"
import { Link } from 'react-router-dom'

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="header-container">
          <Link to="/">
            <img className="logo" src={logo} alt="Missing image"></img>
          </Link>
          <div className="header-links">
            <button className="header-link">
              My Songs
            </button>
            <button className="header-link">
              Global Playlist
            </button>
            <Link to="/signup">
              <button className="signup-btn">
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button className="login-btn">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
