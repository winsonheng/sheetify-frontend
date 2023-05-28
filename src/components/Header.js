import React, { Component } from 'react'
import logo from '../assets/images/logo.png'
import "../assets/styles/Header.css"

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="header-container">
          <img className="logo" src={logo} alt="Missing image"></img>
          <div className="header-links">
            <button className="header-link">
              My Songs
            </button>
            <button className="header-link">
              Global Playlist
            </button>
            <button className="signup-btn">
              Sign Up
            </button>
            <button className="login-btn">
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }
}
