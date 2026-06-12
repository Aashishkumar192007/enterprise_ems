import React, { useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
      setMessage('');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="THE KUMAR's" style={{ height: '60px', marginBottom: '1rem', mixBlendMode: 'multiply' }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Reset Password</h2>
        </div>
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}
        <form onSubmit={handleForgot}>
          <div className="form-group">
            <label className="form-label">Registered Email</label>
            <input type="email" required className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Send Reset Link</button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
