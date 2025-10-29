
// Signup.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector(state => state.auth.status);
  const authError = useSelector(state => state.auth.error);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
      navigate('/login');
    } catch {}
  };

  return (
    <div className="signup-container">
      <div className="header-left">
          <img src="/mountblue-png.png" alt="Logo" className="header-logo" />
        </div>
      <h2 className="signup-title">Create Account</h2>
      {authError && <p className="error-message">{authError}</p>}

      <form className="signup-form" onSubmit={handleSignup}>
        <input
          className="signup-input"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="signup-input"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="signup-input"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="signup-button"
          disabled={authStatus === 'loading'}
        >
          {authStatus === 'loading' ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p className="login-redirect">
        Already have an account? <Link to="/login" className="login-link">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
