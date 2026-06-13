import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useSelector } from 'react-redux';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';

const Tasks = () => {
  const { user } = useSelector(state => state.auth);
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR' || user?.role === 'Manager';

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [groups, setGroups] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'Medium', due_date: '', assigned_to: '', group_id: ''
  });
  
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // Pagination
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    try {
      // In a real app, you might want to paginate the Kanban board, but for simplicity here we fetch a good chunk.
      // If backend supports pagination:
      // const res = await api.get(`/tasks?page=${page}&limit=50`);
      const res = await api.get('/tasks');
      const data = res.data.data;
      setTasks(data);
      // setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOptions = async () => {
    if (!isAdminOrHR) return;
    try {
      const empRes = await api.get('/employees?limit=100');
      if (empRes.data.data.employees) {
        setEmployees(empRes.data.data.employees);
      }
      
      const groupRes = await api.get('/groups');
      if (groupRes.data.data) {
        setGroups(groupRes.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchOptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openModal = (task = null) => {
    setError('');
    setMsg('');
    if (task) {
      setEditMode(true);
      setCurrentId(task.id);
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        assigned_to: task.assigned_to || '',
        group_id: task.group_id || ''
      });
    } else {
      setEditMode(false);
      setCurrentId(null);
      setFormData({ title: '', description: '', priority: 'Medium', due_date: '', assigned_to: '', group_id: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editMode) {
        await api.put(`/tasks/${currentId}`, payload);
        setMsg('Task updated successfully!');
      } else {
        await api.post('/tasks', payload);
        setMsg('Task created successfully!');
      }
      fetchTasks();
      setTimeout(closeModal, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const statuses = ['Todo', 'InProgress', 'Review', 'Done'];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Task Tracking</h2>
        {isAdminOrHR && (
          <button onClick={() => openModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Create Task
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {statuses.map(status => {
          const columnTasks = tasks.filter(t => t.status === status);
          return (
            <div key={status} className="glass" style={{ flex: '0 0 300px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, paddingBottom: '0.5rem', borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                {status.replace(/([A-Z])/g, ' $1').trim()} ({columnTasks.length})
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                {columnTasks.map(task => (
                  <div key={task.id} style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', padding: '1rem', position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px',
                        background: task.priority === 'Urgent' ? 'rgba(239,68,68,0.2)' : 
                                  task.priority === 'High' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)',
                        color: task.priority === 'Urgent' ? 'var(--danger)' : 
                               task.priority === 'High' ? 'var(--warning)' : 'var(--primary-color)'
                      }}>
                        {task.priority}
                      </span>
                      {(isAdminOrHR || task.created_by === user?.id) && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => openModal(task)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={14}/></button>
                          {(user?.role === 'Admin' || user?.role === 'HR') && (
                            <button onClick={() => handleDelete(task.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={14}/></button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h4>
                    {task.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>{task.description}</p>}
                    
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {task.assignee && <div>Assigned to: {task.assignee.name}</div>}
                      {task.group && <div>Group: {task.group.name}</div>}
                      {task.due_date && <div>Due: {new Date(task.due_date).toLocaleDateString()}</div>}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <select 
                        className="form-input" 
                        style={{ padding: '0.4rem', fontSize: '0.85rem' }}
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        disabled={!(isAdminOrHR || task.assigned_to === user?.id || task.created_by === user?.id)}
                      >
                        {statuses.map(s => <option key={s} value={s}>{s.replace(/([A-Z])/g, ' $1').trim()}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                {columnTasks.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>No tasks</div>}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass" style={{ width: '500px', padding: '2rem', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20}/></button>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>{editMode ? 'Edit Task' : 'Create Task'}</h3>
            
            {(error || msg) && (
              <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '8px', background: error ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: error ? 'var(--danger)' : 'var(--success)' }}>
                {error || msg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" required className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-input" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select className="form-input" value={formData.assigned_to} onChange={e => setFormData({...formData, assigned_to: e.target.value})}>
                    <option value="">Unassigned</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Group/Team</label>
                  <select className="form-input" value={formData.group_id} onChange={e => setFormData({...formData, group_id: e.target.value})}>
                    <option value="">None</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {editMode ? 'Update Task' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
