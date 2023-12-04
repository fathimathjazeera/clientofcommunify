import React, { useState } from 'react';
import axios from 'axios';
import main from '../../Images/main.png';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigation = useNavigate()
 
  const initialState = {
    username: '',
    email: '',
    password: '',
  };

  const [isSignUp, setIsSignUp] = useState(true);
  const [data, setData] = useState(initialState);
  const [confirmPass, setConfirmPass] = useState(true);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://communify-server.mrzera.xyz/api/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      alert('Registration success');
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://communify-server.mrzera.xyz/api/login', {
        email: data.email,
        password: data.password,
      });

      const { adminemail, token } = response.data;

      if (adminemail) {
        localStorage.setItem('adminAuthToken', token);
     
      } else {
        localStorage.setItem('authToken', token);
         console.log("logged seccess")
         navigation('/Home')
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const resetForm = () => {
    setData(initialState);
    setConfirmPass(true);
  };

  return (
    <div className="Auth">
      <div className="a-left">
        <img src={main} alt="" />
        <div className="Webname">
          <h1>Communify</h1>
          <h6>Explore the ideas throughout the world</h6>
        </div>
      </div>

      <div className="a-right">
        <form className="infoForm authForm" onSubmit={isSignUp ? handleRegistration : handleLogin}>
          <h3>{isSignUp ? 'Register' : 'Login'}</h3>

          {isSignUp && (
            <div>
              <input
                required
                type="text"
                placeholder="Username"
                className="infoInput"
                name="username"
                onChange={handleChange}
                value={data.username}
              />
            </div>
          )}

          <div>
            <input
              required
              type="email"
              placeholder="Email"
              className="infoInput"
              name="email"
              onChange={handleChange}
              value={data.email}
            />
          </div>

          <div>
            <input
              required
              type="password"
              className="infoInput"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
            />
          </div>

          <span
            style={{
              color: 'red',
              fontSize: '12px',
              alignSelf: 'flex-end',
              marginRight: '5px',
              display: confirmPass ? 'none' : 'block',
            }}
          >
            *Confirm password is not the same
          </span>

          <div>
            <span
              style={{
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={() => {
                resetForm();
                setIsSignUp((prev) => !prev);
              }}
            >
              {isSignUp ? 'Already have an account Login' : "Don't have an account Sign up"}
            </span>
            <button className="button infoButton" type="submit">
             

              {isSignUp ? 'Signup' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
