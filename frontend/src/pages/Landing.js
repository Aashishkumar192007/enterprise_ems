import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, Calendar, Briefcase } from 'lucide-react';

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
      {/* Navbar */}
      <nav style={{ padding: '1.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="THE KUMAR's" style={{ height: '40px', mixBlendMode: 'multiply' }} />
          <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>Enterprise EMS</h2>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Home</Link>
          <Link to="/careers" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Careers</Link>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', textDecoration: 'none' }}>Employee Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '6rem 5%', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.2, background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Manage Your Enterprise Like Never Before
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Streamline HR operations, track assets dynamically, manage employee leaves securely, and recruit top talent—all in one modern, unified platform.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/careers" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.8rem 2rem', textDecoration: 'none' }}>
            View Open Roles <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '4rem 5%', background: 'rgba(0,0,0,0.02)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>Why Choose THE KUMAR's?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { icon: <Users size={32} color="var(--primary-color)"/>, title: 'Employee Directory', desc: 'Secure, RBAC-protected employee profiles and organizational charts.' },
            { icon: <Calendar size={32} color="var(--secondary-color)"/>, title: 'Leave Management', desc: 'Automated leave balances, application tracking, and HR approvals.' },
            { icon: <Briefcase size={32} color="var(--success)"/>, title: 'Asset Tracking', desc: 'Digital inventory ledger to allocate laptops, phones, and equipment.' },
            { icon: <CheckCircle2 size={32} color="var(--warning)"/>, title: 'Attendance', desc: 'Real-time clock-in/out tracking integrated directly into the dashboard.' }
          ].map((feat, idx) => (
            <div key={idx} className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{feat.icon}</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 5%', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} THE KUMAR's Engineering Team. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
