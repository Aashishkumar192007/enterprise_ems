import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';


const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      setSuccess('Registration successful! Please login.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      setSuccess('');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="THE KUMAR's" style={{ height: '60px', marginBottom: '1rem', mixBlendMode: 'multiply' }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Create Account</h2>
        </div>
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{success}</p>}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" required className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" required className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required className="form-input" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Sign Up</button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem' }}>Already have an account? Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
