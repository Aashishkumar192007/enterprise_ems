import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useSelector } from 'react-redux';
import { Clock, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';

const Attendance = () => {
  const { user } = useSelector(state => state.auth);
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR' || user?.role === 'Manager';

  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'company'
  const [myHistory, setMyHistory] = useState([]);
  
  // Company state
  const [companyRecords, setCompanyRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyAttendance();
    if (isAdminOrHR && activeTab === 'company') {
      fetchCompanyAttendance(selectedDate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedDate]);

  const fetchMyAttendance = async () => {
    try {
      const res = await api.get('/attendance/my-attendance');
      setMyHistory(res.data.data.history);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompanyAttendance = async (date) => {
    setLoading(true);
    try {
      const res = await api.get(`/attendance?date=${date}`);
      setCompanyRecords(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateHours = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return '-';
    const diff = new Date(clockOut) - new Date(clockIn);
    const hours = (diff / (1000 * 60 * 60)).toFixed(1);
    return `${hours} hrs`;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Attendance Tracking</h2>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <button 
          className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
          onClick={() => setActiveTab('my')}
          style={{ 
            background: 'none', border: 'none', padding: '1rem 2rem', cursor: 'pointer',
            color: activeTab === 'my' ? 'var(--primary-color)' : 'var(--text-muted)',
            borderBottom: activeTab === 'my' ? '2px solid var(--primary-color)' : '2px solid transparent',
            fontWeight: activeTab === 'my' ? 'bold' : 'normal',
            transition: 'all 0.2s'
          }}
        >
          My Attendance
        </button>
        {isAdminOrHR && (
          <button 
            className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`}
            onClick={() => setActiveTab('company')}
            style={{ 
              background: 'none', border: 'none', padding: '1rem 2rem', cursor: 'pointer',
              color: activeTab === 'company' ? 'var(--primary-color)' : 'var(--text-muted)',
              borderBottom: activeTab === 'company' ? '2px solid var(--primary-color)' : '2px solid transparent',
              fontWeight: activeTab === 'company' ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
          >
            Company Attendance
          </button>
        )}
      </div>

      {activeTab === 'my' && (
        <div className="glass animate-fade-in" style={{ padding: '2rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} /> My Recent Attendance
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Clock In</th>
                  <th style={{ padding: '1rem' }}>Clock Out</th>
                  <th style={{ padding: '1rem' }}>Hours</th>
                </tr>
              </thead>
              <tbody>
                {myHistory.map(record => (
                  <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem' }}>{new Date(record.date).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem',
                        background: record.status === 'Present' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: record.status === 'Present' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {record.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{formatTime(record.clock_in)}</td>
                    <td style={{ padding: '1rem' }}>{formatTime(record.clock_out)}</td>
                    <td style={{ padding: '1rem' }}>{calculateHours(record.clock_in, record.clock_out)}</td>
                  </tr>
                ))}
                {myHistory.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No attendance records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'company' && isAdminOrHR && (
        <div className="glass animate-fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={20} /> Daily Roster
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)' }}>Date: </label>
              <input 
                type="date" 
                className="form-input" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ width: 'auto' }}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading records...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem' }}>Employee</th>
                    <th style={{ padding: '1rem' }}>Role</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Clock In</th>
                    <th style={{ padding: '1rem' }}>Clock Out</th>
                  </tr>
                </thead>
                <tbody>
                  {companyRecords.map(record => (
                    <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500' }}>{record.user.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{record.user.email}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>{record.user.role}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                          background: record.status === 'Present' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: record.status === 'Present' ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {record.status === 'Present' ? <CheckCircle size={14}/> : <XCircle size={14}/>} {record.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{formatTime(record.clock_in)}</td>
                      <td style={{ padding: '1rem' }}>{formatTime(record.clock_out)}</td>
                    </tr>
                  ))}
                  {companyRecords.length === 0 && (
                    <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No records found for {new Date(selectedDate).toLocaleDateString()}.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
