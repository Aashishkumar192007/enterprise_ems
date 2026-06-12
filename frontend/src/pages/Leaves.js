import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const Leaves = () => {
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('my-leaves');
  
  // My Leaves state
  const [myLeaves, setMyLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [formData, setFormData] = useState({ leave_type_id: '', start_date: '', end_date: '', reason: '' });
  const [error, setError] = useState('');
  
  // Approvals state
  const [allApplications, setAllApplications] = useState([]);

  useEffect(() => {
    fetchMyLeaves();
    fetchLeaveTypes();
    if (user?.role === 'Admin' || user?.role === 'HR') {
      fetchAllApplications();
    }
  }, [user]);

  const fetchMyLeaves = async () => {
    try {
      const res = await api.get('/leave/my-leaves');
      setMyLeaves(res.data.data.leaves);
      setBalances(res.data.data.balances);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const res = await api.get('/leave/types');
      setLeaveTypes(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllApplications = async () => {
    try {
      const res = await api.get('/leave');
      // The backend returns { applications: [...] } or just an array? Let's assume array or object.
      // Wait, let's assume res.data.data is the array of applications for now or res.data.data.applications
      const data = res.data.data;
      setAllApplications(Array.isArray(data) ? data : data.applications || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leave/apply', {
        ...formData,
        leave_type_id: parseInt(formData.leave_type_id)
      });
      setFormData({ leave_type_id: '', start_date: '', end_date: '', reason: '' });
      fetchMyLeaves();
      if (user?.role === 'Admin' || user?.role === 'HR') {
        fetchAllApplications();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for leave');
    }
  };

  const handleProcess = async (id, status) => {
    try {
      await api.post(`/leave/${id}/process`, { status, comments: `Processed as ${status}` });
      fetchAllApplications();
      fetchMyLeaves(); // In case admin applies for themselves
    } catch (err) {
      console.error('Process failed', err);
    }
  };

  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="THE KUMAR's" style={{ height: '40px', mixBlendMode: 'multiply' }} />
          <h2 style={{ margin: 0 }}>Leave Management</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button className={`btn ${activeTab === 'my-leaves' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('my-leaves')}>My Leaves</button>
        {isAdminOrHR && (
          <button className={`btn ${activeTab === 'approvals' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('approvals')}>Approvals</button>
        )}
      </div>

      {activeTab === 'my-leaves' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div className="glass animate-fade-in" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Request Leave</h3>
            {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">Leave Type</label>
                <select className="form-input" required value={formData.leave_type_id} onChange={e => setFormData({...formData, leave_type_id: e.target.value})}>
                  <option value="">Select Type</option>
                  {leaveTypes.map(t => <option key={t.id} value={t.id}>{t.type_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" required className="form-input" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" required className="form-input" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <textarea className="form-input" rows="3" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Request</button>
            </form>
            
            <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Balances</h4>
            {balances.map(b => (
              <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span>{b.leaveType.type_name}</span>
                <span style={{ fontWeight: 'bold' }}>{b.balance} days</span>
              </div>
            ))}
          </div>

          <div className="glass animate-fade-in" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>My Leave History</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Type</th>
                  <th style={{ padding: '1rem' }}>Duration</th>
                  <th style={{ padding: '1rem' }}>Reason</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {myLeaves.map(leave => (
                  <tr key={leave.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{leave.leaveType?.type_name || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>{new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>{leave.reason || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        background: leave.status === 'Approved' ? 'rgba(16,185,129,0.2)' : leave.status === 'Rejected' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                        color: leave.status === 'Approved' ? 'var(--success)' : leave.status === 'Rejected' ? 'var(--danger)' : 'var(--warning)',
                      }}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {myLeaves.length === 0 && <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No leaves found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="glass animate-fade-in" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Pending Leave Applications</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem' }}>User ID</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Duration</th>
                <th style={{ padding: '1rem' }}>Reason</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allApplications.filter(app => app.status === 'Pending').map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{app.user_id}</td>
                  <td style={{ padding: '1rem' }}>{app.leave_type_id}</td>
                  <td style={{ padding: '1rem' }}>{new Date(app.start_date).toLocaleDateString()} - {new Date(app.end_date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>{app.reason}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleProcess(app.id, 'Approved')} className="btn" style={{ background: 'var(--success)', color: 'white', padding: '0.3rem 0.6rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><CheckCircle size={16} /></button>
                    <button onClick={() => handleProcess(app.id, 'Rejected')} className="btn" style={{ background: 'var(--danger)', color: 'white', padding: '0.3rem 0.6rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><XCircle size={16} /></button>
                  </td>
                </tr>
              ))}
              {allApplications.filter(app => app.status === 'Pending').length === 0 && <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No pending applications</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaves;
