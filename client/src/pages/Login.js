// Login.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector(state => state.auth.status);
  const authError = useSelector(state => state.auth.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/todos');
    } catch {}
  };

  return (
    <div className="login-container">
      <div className="header-left">
          <img src="/mountblue-png.png" alt="Logo" className="header-logo" />
        </div>
      <h2 className="login-title">Welcome Back</h2>
      {authError && <p className="error-message">{authError}</p>}

      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="login-button"
          disabled={authStatus === 'loading'}
        >
          {authStatus === 'loading' ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="signup-redirect">
        Don't have an account? <Link to="/signup" className="signup-link">Signup</Link>
      </p>
    </div>
  );
}

export default Login;
