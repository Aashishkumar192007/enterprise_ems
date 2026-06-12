import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import { Users, Briefcase, Calendar } from 'lucide-react';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [attendance, setAttendance] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, attRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/attendance/my-attendance')
        ]);
        setStats(statsRes.data.data);
        setAttendance(attRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };
    fetchDashboardData();
  }, []);

  const handleClockIn = async () => {
    try {
      await api.post('/attendance/clock-in');
      const attRes = await api.get('/attendance/my-attendance');
      setAttendance(attRes.data.data);
    } catch (err) {
      alert('Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    try {
      await api.post('/attendance/clock-out');
      const attRes = await api.get('/attendance/my-attendance');
      setAttendance(attRes.data.data);
    } catch (err) {
      alert('Failed to clock out');
    }
  };

  if (!stats || !attendance) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

  const { totalEmployees, totalDepartments, pendingLeaves, employeeTrendData, departmentData, leaveTrends, assetAllocations } = stats;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="THE KUMAR's" style={{ height: '40px', mixBlendMode: 'multiply' }} />
          <h1 style={{ display: 'none' }}>THE KUMAR's Dashboard</h1>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px' }}>
            <Users size={32} color="var(--primary-color)" />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{totalEmployees}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Total Employees</p>
          </div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '12px' }}>
            <Briefcase size={32} color="var(--secondary-color)" />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{totalDepartments}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Departments</p>
          </div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px' }}>
            <Calendar size={32} color="var(--warning)" />
          </div>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0 }}>{pendingLeaves}</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Leaves Pending</p>
          </div>
        </div>
      </div>

      {/* Attendance Module */}
      <div className="glass animate-fade-in" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>Daily Attendance</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {attendance.today ? (
              attendance.today.clock_out ? `Clocked out at ${new Date(attendance.today.clock_out).toLocaleTimeString()}` :
              attendance.today.clock_in ? `Clocked in at ${new Date(attendance.today.clock_in).toLocaleTimeString()}` :
              "Not clocked in yet today."
            ) : "Not clocked in yet today."}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleClockIn} 
            disabled={attendance.today?.clock_in}
            style={{ opacity: attendance.today?.clock_in ? 0.5 : 1 }}
          >
            Clock In
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleClockOut} 
            disabled={!attendance.today?.clock_in || attendance.today?.clock_out}
            style={{ opacity: (!attendance.today?.clock_in || attendance.today?.clock_out) ? 0.5 : 1 }}
          >
            Clock Out
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
        <div className="glass animate-fade-in" style={{ padding: '1.5rem', height: '350px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Employee Growth (Area Chart)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={employeeTrendData}>
              <defs>
                <linearGradient id="colorEmp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }} />
              <Area type="monotone" dataKey="employees" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorEmp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass animate-fade-in" style={{ padding: '1.5rem', height: '350px', animationDelay: '0.1s' }}>
          <h3 style={{ marginBottom: '1rem' }}>Department Distribution (Pie Chart)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" label>
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass animate-fade-in" style={{ padding: '1.5rem', height: '350px', animationDelay: '0.2s' }}>
          <h3 style={{ marginBottom: '1rem' }}>Asset Allocations (Bar Chart)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={assetAllocations}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }} />
              <Bar dataKey="count" fill="var(--secondary-color)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass animate-fade-in" style={{ padding: '1.5rem', height: '350px', animationDelay: '0.3s' }}>
          <h3 style={{ marginBottom: '1rem' }}>Leave Trends (Line Chart)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leaveTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }} />
              <Line type="monotone" dataKey="leaves" stroke="var(--success)" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
