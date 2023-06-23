import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { BACKEND_BASE_URL } from '../constants/config';
import { StatusCode, postData } from '../util/RestUtil';
import { USERS_SIGNUP_EMAIL } from '../constants/endpoints';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/SignupPage.css'

export default class SignupPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      retypePassword: '',
      isEmailValid: false,
      isPasswordValid: false,
      isPasswordMatched: false,
      isFormSubmitted: true // TODO: change this to false
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRetypePasswordChange = this.handleRetypePasswordChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.preventSubmit = this.preventSubmit.bind(this);
    this.googleLoginSuccess = this.googleLoginSuccess.bind(this);
    this.googleLoginError = this.googleLoginError.bind(this);
  }
  
  componentDidMount() {
  
  }

  handleEmailChange(e) {
    const email = e.target.value;
    this.setState({ 
      email: email,
      isEmailValid: e.target.checkValidity()
    });
  }

  handlePasswordChange(e) {
    const password = e.target.value;
    const hasValidLength = password.length >= 8 && password.length <= 20;
    const containsSmallChars = (password.match(/[a-z]/g) || []).length > 0;
    const containsCapitalChars = (password.match(/[A-Z]/g) || []).length > 0;
    const containsNumbers = (password.match(/[0-9]/g) || []).length > 0;
    const containsSymbols = (password.match(/[^\w\s]|_/g) || []).length > 0;
    const isPasswordValid = hasValidLength && containsSmallChars && containsCapitalChars && containsNumbers && containsSymbols;

    this.setState({ 
      password: password, 
      isPasswordValid: isPasswordValid,
      isPasswordMatched: this.state.retypePassword === password
    });
  }

  handleRetypePasswordChange(e) {
    const retypePassword = e.target.value;
    this.setState({ 
      retypePassword: retypePassword, 
      isPasswordMatched: this.state.password === retypePassword
    });
  }

  onSubmit(e) {
    if (!this.state.isEmailValid || !this.state.isPasswordValid || !this.state.isPasswordMatched) {
      return;
    }

    postData(BACKEND_BASE_URL + USERS_SIGNUP_EMAIL,
      {
        email: this.state.email,
        password: this.state.password
      }
    ).then(response => {
      if (response.status === StatusCode.OK) {
        this.setState({ isFormSubmitted: true });
      } else if (response.status === StatusCode.BAD_REQUEST && response.data.accountExist) {
        console.log('Account already exists!');
        toast.info('Account already exists! Please proceed to login');
      }
    })
    
  }

  preventSubmit(e) {
    e.preventDefault();
  }

  googleLoginSuccess(response) {
    console.log('Google login successful!', response);
    googleLogout();
  }

  googleLoginError() {
    console.log('Google login error!');
  }

  render() {
    return (
      <div className='signup-page'>
        <ToastContainer theme='colored'/>
        <form className='signup-form' onSubmit={this.preventSubmit}>
          <div className='create-account-left'>
            <h3 className='create-account-text'>
              Create<br></br>
              A Free<br></br>
              Account
            </h3>
            <p className='create-account-login'>
              Already have an account?<br></br>
              <Link to="/login" className='create-account-login-link'>
                Login here
              </Link>
            </p>
          </div>
          <div className='create-account-right'>
            {(() => {
              if (this.state.isFormSubmitted) {
                return (
                  <div className='signup-email-sent-wrapper'>
                    <h1 className='signup-email-sent-header'>
                      Account created successfully!
                      {/**Verify your account */}
                    </h1>
                    <div className='signup-email-sent-icon'/>
                    <p className='signup-email-sent-text'>
                      You may now proceed to login.
                      {/**We've sent an email to {this.state.email}.
                       * <br></br>Please click on the link to activate your account.*/}
                    </p>
                    <div className='signup-email-resend-wrapper create-account-btn-wrapper'>
                    <Link to="/login" state={{email: this.state.email}} className='create-account-login-link'>
                      <button className='signup-email-resend create-account-btn'>
                        Go to login page
                        {/**Resend Email */}
                      </button>
                    </Link>
                      
                    </div>
                  </div>
                );
              } else {
                return (
                  <>
                    <div className='signup-email-section'>
                      <Form.Group 
                        className='signup-form-group' 
                        controlId='signupEmail' 
                        onChange={this.handleEmailChange}
                      >
                        <div className='signup-form-email-icon'/>
                        <Form.Control 
                          className={'form-control' + (this.state.email !== '' && !this.state.isEmailValid ? 
                            ' invalid-password' : 
                            '')
                          } 
                          type='email' 
                          placeholder='Email'
                        />
                      </Form.Group>
                      <Form.Group 
                        className='signup-form-group' 
                        controlId='signupPassword'
                        onChange={this.handlePasswordChange}
                      >
                        <div className='signup-form-password-icon'/>
                        <Form.Control 
                          className={'form-control' + (this.state.password !== '' && !this.state.isPasswordValid ? 
                            ' invalid-password' : 
                            '')
                          } 
                          type='password' 
                          placeholder='Password' 
                          required
                        />
                        <Form.Text className={'signup-form-password-text' + (this.state.password !== '' && !this.state.isPasswordValid ? ' invalid-password' : '')}>
                          *8-20 characters including at least 1 special character
                        </Form.Text>
                      </Form.Group>
                      <Form.Group 
                        className='signup-form-group' 
                        controlId='signupRetypePassword'
                        onChange={this.handleRetypePasswordChange}
                      >
                        <div className='signup-form-retype-password-icon'/>
                        <Form.Control 
                          className={'form-control' + 
                            (this.state.retypePassword !== '' && !this.state.isPasswordMatched ? 
                              ' invalid-password' : 
                              '')
                          } 
                          type='password' 
                          placeholder='Retype password' 
                          required
                        />
                        <Form.Text 
                          className='signup-form-retype-password-text' 
                          hidden={this.state.retypePassword === '' || this.state.isPasswordMatched}
                        >
                          Password does not match
                        </Form.Text>
                      </Form.Group>
                      <div className='create-account-btn-wrapper'>
                        <button className='create-account-btn' onClick={this.onSubmit}>
                          Create Account
                        </button>
                      </div>
                    </div>
                    <div className='signup-separator'>
                      <div className='line'>

                      </div>
                      <div className='signup-separator-or'>
                        OR
                      </div>
                      <div className='line'>

                      </div>
                    </div>
                    <div className='signup-external-section'>
                      
                      <GoogleLogin
                        className='google-login'
                        size='large'
                        theme='outline'
                        context='signup'
                        text='signup_with'
                        onSuccess={this.googleLoginSuccess}
                        onError={this.googleLoginError}
                        useOneTap
                      />
                    </div>
                  </>
                );
              }
            })()}
            
          </div>
        </form>
      </div>
    )
  }
}
