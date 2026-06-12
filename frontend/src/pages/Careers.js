import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Briefcase, X, ArrowLeft } from 'lucide-react';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', cover_letter: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app we'd fetch this without the auth interceptor, 
    // or configure api.js to skip tokens for certain routes.
    // Assuming backend /api/jobs is public
    api.get('/jobs')
      .then(res => setJobs(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/jobs/${selectedJob.id}/apply`, formData);
      setMsg('Application submitted successfully!');
      setFormData({ name: '', email: '', cover_letter: '' });
      setTimeout(() => {
        setSelectedJob(null);
        setMsg('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
      {/* Navbar */}
      <nav style={{ padding: '1.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="THE KUMAR's" style={{ height: '40px', mixBlendMode: 'multiply' }} />
          <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Careers</h2>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}><ArrowLeft size={16} style={{marginRight: '5px', verticalAlign:'middle'}}/> Back to Home</Link>
        </div>
      </nav>

      {/* Main Content */}
      <section style={{ padding: '4rem 5%', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Join Our Team</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>We are always looking for passionate individuals to help build the future.</p>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {jobs.length === 0 ? (
            <div className="glass" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No open positions at the moment. Please check back later.
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="glass" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={16}/> {job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Briefcase size={16}/> {job.department}</span>
                  </div>
                  <p style={{ color: 'var(--text-main)' }}>{job.description}</p>
                </div>
                <button onClick={() => { setSelectedJob(job); setMsg(''); setError(''); }} className="btn btn-primary">Apply Now</button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Apply Modal */}
      {selectedJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass" style={{ width: '500px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setSelectedJob(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}><X size={20}/></button>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Apply for {selectedJob.title}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Fill out the form below to submit your application.</p>
            
            {(error || msg) && (
              <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '8px', background: error ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: error ? 'var(--danger)' : 'var(--success)' }}>
                {error || msg}
              </div>
            )}

            <form onSubmit={handleApply} style={{ display: 'grid', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" required className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Letter</label>
                <textarea required className="form-input" rows="4" value={formData.cover_letter} onChange={e => setFormData({...formData, cover_letter: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Submit Application</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
