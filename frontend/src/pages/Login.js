import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      dispatch(loginSuccess({ user: res.data.data.user, token: res.data.data.accessToken }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="THE KUMAR's" style={{ height: '60px', marginBottom: '1rem', mixBlendMode: 'multiply' }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Welcome Back</h2>
        </div>
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" required className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Log In</button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/forgot-password" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Forgot your password?</Link>
          <Link to="/signup" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem' }}>Don't have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
