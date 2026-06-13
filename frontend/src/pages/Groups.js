import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useSelector } from 'react-redux';
import { Plus, X, Trash2, Users } from 'lucide-react';

const Groups = () => {
  const { user } = useSelector(state => state.auth);
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  const [groups, setGroups] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [memberForm, setMemberForm] = useState({ user_id: '', role: 'Member' });

  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // Pagination (assuming standard page/limit if needed, right now we just render all fetched)
  const [page, setPage] = useState(1);
  const limit = 10;
  // If groups pagination is supported in backend later, this will be used.

  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups');
      setGroups(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    if (!isAdminOrHR) return;
    try {
      const empRes = await api.get('/employees?limit=100');
      if (empRes.data.data.employees) {
        setEmployees(empRes.data.data.employees);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchEmployees();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openGroupModal = () => {
    setError(''); setMsg('');
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/groups', formData);
      setMsg('Group created successfully!');
      fetchGroups();
      setTimeout(() => setShowModal(false), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  const handleDeleteGroup = async (id) => {
    if (window.confirm('Are you sure you want to delete this group? All memberships will be removed and tasks unlinked.')) {
      try {
        await api.delete(`/groups/${id}`);
        fetchGroups();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const openMemberModal = (group) => {
    setError(''); setMsg('');
    setSelectedGroup(group);
    setMemberForm({ user_id: '', role: 'Member' });
    setShowMemberModal(true);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/groups/${selectedGroup.id}/members`, memberForm);
      setMsg('Member added successfully!');
      fetchGroups();
      setTimeout(() => setShowMemberModal(false), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (groupId, userId) => {
    if (window.confirm('Remove this member?')) {
      try {
        await api.delete(`/groups/${groupId}/members/${userId}`);
        fetchGroups();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Groups & Teams</h2>
        {isAdminOrHR && (
          <button onClick={openGroupModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Create Group
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {groups.map(group => (
          <div key={group.id} className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} /> {group.name}
                </h3>
                {group.description && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{group.description}</p>}
              </div>
              {user?.role === 'Admin' && (
                <button onClick={() => handleDeleteGroup(group.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Members: {group.members?.length || 0}</span>
              <span>Tasks: {group._count?.tasks || 0}</span>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Members</h4>
                {isAdminOrHR && (
                  <button onClick={() => openMemberModal(group)} className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>
                    + Add
                  </button>
                )}
              </div>
              
              <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {group.members?.map(m => (
                  <div key={m.user_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem' }}>{m.user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.role} • {m.user.role}</div>
                    </div>
                    {isAdminOrHR && (
                      <button onClick={() => handleRemoveMember(group.id, m.user_id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {(!group.members || group.members.length === 0) && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No members yet</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass" style={{ width: '400px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20}/></button>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Create Group</h3>
            
            {(error || msg) && (
              <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '8px', background: error ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: error ? 'var(--danger)' : 'var(--success)' }}>
                {error || msg}
              </div>
            )}

            <form onSubmit={handleGroupSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Group Name</label>
                <input type="text" required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create</button>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass" style={{ width: '400px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowMemberModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20}/></button>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Add Member to {selectedGroup?.name}</h3>
            
            {(error || msg) && (
              <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '8px', background: error ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: error ? 'var(--danger)' : 'var(--success)' }}>
                {error || msg}
              </div>
            )}

            <form onSubmit={handleAddMember} style={{ display: 'grid', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Select Employee</label>
                <select className="form-input" required value={memberForm.user_id} onChange={e => setMemberForm({...memberForm, user_id: e.target.value})}>
                  <option value="">Choose Employee...</option>
                  {employees.filter(emp => !selectedGroup.members?.find(m => m.user_id === emp.id)).map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Group Role</label>
                <select className="form-input" value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})}>
                  <option value="Member">Member</option>
                  <option value="Lead">Team Lead</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Member</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Groups;
