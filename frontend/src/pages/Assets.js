import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useSelector } from 'react-redux';
import { Plus, UserCheck } from 'lucide-react';

const Assets = () => {
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('inventory');
  
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  const [assetForm, setAssetForm] = useState({ asset_name: '', asset_type: '', serial_number: '' });
  const [allocateForm, setAllocateForm] = useState({ asset_id: '', user_id: '' });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchAssets();
    fetchEmployees();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await api.get('/assets');
      setAssets(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees?limit=100'); // Assuming limit 100 for dropdown
      setEmployees(res.data.data.employees || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assets', assetForm);
      setAssetForm({ asset_name: '', asset_type: '', serial_number: '' });
      setMsg('Asset added successfully!');
      setError('');
      fetchAssets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add asset');
      setMsg('');
    }
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/assets/${allocateForm.asset_id}/allocate`, { user_id: allocateForm.user_id });
      setAllocateForm({ asset_id: '', user_id: '' });
      setMsg('Asset allocated successfully!');
      setError('');
      fetchAssets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to allocate asset');
      setMsg('');
    }
  };

  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="THE KUMAR's" style={{ height: '40px', mixBlendMode: 'multiply' }} />
          <h2 style={{ margin: 0 }}>Asset Tracking</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => {setActiveTab('inventory'); setMsg(''); setError('');}}>Inventory</button>
        {isAdminOrHR && (
          <button className={`btn ${activeTab === 'allocate' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => {setActiveTab('allocate'); setMsg(''); setError('');}}>Allocate</button>
        )}
      </div>

      {(error || msg) && (
        <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '8px', background: error ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: error ? 'var(--danger)' : 'var(--success)' }}>
          {error || msg}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div style={{ display: 'grid', gridTemplateColumns: isAdminOrHR ? '1fr 2fr' : '1fr', gap: '2rem' }}>
          {isAdminOrHR && (
            <div className="glass animate-fade-in" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={20} /> Add New Asset</h3>
              <form onSubmit={handleAddAsset}>
                <div className="form-group">
                  <label className="form-label">Asset Name</label>
                  <input type="text" required className="form-input" placeholder="e.g. MacBook Pro M3" value={assetForm.asset_name} onChange={e => setAssetForm({...assetForm, asset_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Asset Type</label>
                  <select className="form-input" required value={assetForm.asset_type} onChange={e => setAssetForm({...assetForm, asset_type: e.target.value})}>
                    <option value="">Select Type</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Phone">Phone</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Accessory">Accessory</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Serial Number</label>
                  <input type="text" required className="form-input" value={assetForm.serial_number} onChange={e => setAssetForm({...assetForm, serial_number: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Asset</button>
              </form>
            </div>
          )}

          <div className="glass animate-fade-in" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Company Assets</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem' }}>ID</th>
                  <th style={{ padding: '1rem' }}>Name / Type</th>
                  <th style={{ padding: '1rem' }}>Serial</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => {
                  const currentAllocation = asset.allocations?.find(a => !a.return_date);
                  return (
                    <tr key={asset.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>{asset.id}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500' }}>{asset.asset_name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{asset.asset_type}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>{asset.serial_number}</td>
                      <td style={{ padding: '1rem' }}>
                        {currentAllocation ? (
                          <span style={{ color: 'var(--warning)', fontSize: '0.9rem' }}>Allocated to {currentAllocation.user?.name || 'User ' + currentAllocation.user_id}</span>
                        ) : (
                          <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>Available</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {assets.length === 0 && <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No assets found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'allocate' && isAdminOrHR && (
        <div className="glass animate-fade-in" style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserCheck size={20} /> Allocate Asset to Employee</h3>
          <form onSubmit={handleAllocate}>
            <div className="form-group">
              <label className="form-label">Select Available Asset</label>
              <select className="form-input" required value={allocateForm.asset_id} onChange={e => setAllocateForm({...allocateForm, asset_id: e.target.value})}>
                <option value="">Choose Asset</option>
                {assets.filter(a => !a.allocations?.find(al => !al.return_date)).map(a => (
                  <option key={a.id} value={a.id}>{a.asset_name} ({a.serial_number})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Select Employee</label>
              <select className="form-input" required value={allocateForm.user_id} onChange={e => setAllocateForm({...allocateForm, user_id: e.target.value})}>
                <option value="">Choose Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Allocate</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Assets;
