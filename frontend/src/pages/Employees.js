import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, ChevronUp, ChevronDown, Download, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const Employees = () => {
  const { user } = useSelector(state => state.auth);
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const limit = 5;

  // CRUD State
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    designation: '',
    department_id: '',
    salary: ''
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const fetchEmployees = async () => {
    try {
      const res = await api.get(`/employees?page=${page}&limit=${limit}&search=${search}`);
      let data = res.data.data.employees;
      
      data.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        
        if (sortField === 'salary') {
          valA = a.employeeProfile?.salary || 0;
          valB = b.employeeProfile?.salary || 0;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      setEmployees(data);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await api.get(`/reports/employees?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employees.${format === 'excel' ? 'xlsx' : format}`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  // CRUD Functions
  const openModal = (emp = null) => {
    setError('');
    setMsg('');
    if (emp) {
      setEditMode(true);
      setCurrentId(emp.id);
      setFormData({
        name: emp.name || '',
        email: emp.email || '',
        password: '', // Leave blank when editing
        role: emp.role || 'User',
        designation: emp.employeeProfile?.designation || '',
        department_id: emp.department_id || '',
        salary: emp.employeeProfile?.salary || ''
      });
    } else {
      setEditMode(false);
      setCurrentId(null);
      setFormData({ name: '', email: '', password: '', role: 'User', designation: '', department_id: '', salary: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', password: '', role: 'User', designation: '', department_id: '', salary: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.salary) payload.salary = parseFloat(payload.salary);
      payload.department_id = payload.department_id ? parseInt(payload.department_id) : 1; // Default to 'General' department
      if (editMode && !payload.password) delete payload.password; // don't send empty password

      if (editMode) {
        await api.put(`/employees/${currentId}`, payload);
        setMsg('Employee updated successfully!');
      } else {
        await api.post('/employees', payload);
        setMsg('Employee created successfully!');
      }
      fetchEmployees();
      setTimeout(closeModal, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="THE KUMAR's" style={{ height: '40px', mixBlendMode: 'multiply' }} />
          <h2 style={{ margin: 0 }}>Employee Directory</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isAdminOrHR && (
            <button onClick={() => openModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Add Employee
            </button>
          )}
          <button onClick={() => handleExport('csv')} className="btn btn-secondary"><Download size={16} /> CSV</button>
          <button onClick={() => handleExport('pdf')} className="btn btn-secondary"><Download size={16} /> PDF</button>
          <button onClick={() => handleExport('excel')} className="btn btn-secondary" style={{ background: '#10b981', color: '#fff', border: 'none' }}><Download size={16} /> Excel</button>
        </div>
      </div>

      <div className="glass animate-fade-in" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', marginBottom: '1.5rem', position: 'relative' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
          <input 
            type="text" 
            placeholder="Search employees by name, email, or designation..." 
            className="form-input" 
            style={{ paddingLeft: '40px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('id')}>
                  ID {sortField === 'id' && (sortOrder === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </th>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortOrder === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </th>
                <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('email')}>
                  Email {sortField === 'email' && (sortOrder === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </th>
                {isAdminOrHR && (
                  <th style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => handleSort('salary')}>
                    Salary {sortField === 'salary' && (sortOrder === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                  </th>
                )}
                {isAdminOrHR && <th style={{ padding: '1rem' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem' }}>{emp.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{emp.employeeProfile?.designation || 'N/A'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{emp.email}</td>
                  {isAdminOrHR && <td style={{ padding: '1rem' }}>${emp.employeeProfile?.salary?.toLocaleString() || '0'}</td>}
                  {isAdminOrHR && (
                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openModal(emp)} className="btn btn-secondary" style={{ padding: '0.3rem 0.5rem' }} title="Edit"><Edit2 size={14}/></button>
                      <button onClick={() => handleDelete(emp.id)} className="btn btn-secondary" style={{ padding: '0.3rem 0.5rem', color: 'var(--danger)' }} title="Delete"><Trash2 size={14}/></button>
                    </td>
                  )}
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={isAdminOrHR ? "5" : "4"} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No employees found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Page {page} of {totalPages || 1}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{ padding: '0.5rem 1rem' }}
            >
              Previous
            </button>
            <button 
              className="btn btn-secondary" 
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              style={{ padding: '0.5rem 1rem' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CRUD Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass" style={{ width: '500px', padding: '2rem', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20}/></button>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{editMode ? 'Edit Employee' : 'Add Employee'}</h3>
            
            {(error || msg) && (
              <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '8px', background: error ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: error ? 'var(--danger)' : 'var(--success)' }}>
                {error || msg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" required className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Password {editMode && <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>(leave blank to keep current)</span>}</label>
                <input type="password" required={!editMode} minLength="6" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="User">User</option>
                    <option value="HR">HR</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Salary ($)</label>
                  <input type="number" className="form-input" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input type="text" className="form-input" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {editMode ? 'Update Employee' : 'Create Employee'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Employees;
