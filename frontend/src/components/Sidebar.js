import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Laptop, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Employees', path: '/employees', icon: <Users size={20} /> },
    { name: 'Leaves', path: '/leaves', icon: <Calendar size={20} /> },
    { name: 'Assets', path: '/assets', icon: <Laptop size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <LayoutDashboard size={20} /> },
    { name: 'Groups', path: '/groups', icon: <Users size={20} /> },
  ];

  return (
    <div style={{
      width: '260px',
      height: '100vh',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem', paddingLeft: '1rem' }}>
        <img src="/logo.png" alt="THE KUMAR's" style={{ height: '32px', mixBlendMode: 'multiply' }} />
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-color)' }}>THE KUMAR's</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              color: isActive ? '#fff' : 'var(--text-muted)',
              background: isActive ? 'var(--primary-color)' : 'transparent',
              transition: 'all 0.2s',
              fontWeight: isActive ? '500' : 'normal'
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
        <div style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
          <div style={{ fontWeight: '500' }}>{user?.name || 'Admin'}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.role || 'System'}</div>
        </div>
        <button 
          onClick={handleLogout} 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            padding: '0.8rem 1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
