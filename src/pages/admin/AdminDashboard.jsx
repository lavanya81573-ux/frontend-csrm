import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Users,
  UserCheck,
  Layers,
  CalendarCheck,
  Calendar,
  AlertTriangle,
  Percent,
  XCircle,
  ArrowRight,
  ShieldCheck,
  FileBarChart
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Calculating campus analytics & dashboard metrics..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Admin Control Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            System overview, resource utilization, pending approvals, and operational health
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/reports" className="btn btn-secondary">
            <FileBarChart size={16} />
            <span>View Reports</span>
          </Link>
          <Link to="/admin/audit" className="btn btn-primary">
            <ShieldCheck size={16} />
            <span>Audit Logs</span>
          </Link>
        </div>
      </div>

      {/* Pending Users Notification Banner */}
      {stats?.pendingUsers > 0 && (
        <div className="alert alert-warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="#b45309" />
            <div>
              <strong>Action Required:</strong> {stats.pendingUsers} new account registration(s) awaiting administrative review.
            </div>
          </div>
          <Link to="/admin/users" className="btn btn-primary btn-sm" style={{ background: '#b45309', borderColor: '#b45309' }}>
            Review Pending Users
          </Link>
        </div>
      )}

      {/* 8 Primary Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <Users size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-yellow">
            <UserCheck size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.pendingUsers || 0}</div>
            <div className="stat-label">Pending Approvals</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <Layers size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.totalResources || 0}</div>
            <div className="stat-label">Total Resources</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <CalendarCheck size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.activeBookings || 0}</div>
            <div className="stat-label">Active Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <Calendar size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.todayBookings || 0}</div>
            <div className="stat-label">Today's Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-red">
            <XCircle size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.cancelledBookings || 0}</div>
            <div className="stat-label">Cancelled Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-red">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.bookingConflicts || 0}</div>
            <div className="stat-label">Booking Conflicts Prevented</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <Percent size={22} />
          </div>
          <div>
            <div className="stat-value">{stats?.resourceUtilization || 0}%</div>
            <div className="stat-label">Resource Utilization</div>
          </div>
        </div>
      </div>

      {/* Grid: Resource Distribution & Bookings By Type */}
      <div className="grid-2">
        {/* Facilities Breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Campus Resources by Type</h2>
              <p className="card-subtitle">Distribution of classrooms, labs, lockers, equipment</p>
            </div>
            <Link to="/admin/resources" className="btn btn-secondary btn-sm">
              Manage <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(stats?.resourcesByType || {}).map(([type, count]) => {
              const total = stats?.totalResources || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{type}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: type === 'CLASSROOM' ? '#3b82f6' : type === 'LAB' ? '#10b981' : type === 'LOCKER' ? '#f59e0b' : '#8b5cf6',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bookings Usage Breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Bookings by Category</h2>
              <p className="card-subtitle">Volume of reservations across facility categories</p>
            </div>
            <Link to="/admin/bookings" className="btn btn-secondary btn-sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(stats?.bookingsByType || {}).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No bookings recorded yet.</p>
            ) : (
              Object.entries(stats?.bookingsByType || {}).map(([type, count]) => (
                <div key={type} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: '#f8fafc',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)'
                }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{type}</span>
                  <span style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--primary)',
                    background: 'var(--primary-light)',
                    padding: '2px 10px',
                    borderRadius: '9999px'
                  }}>
                    {count} bookings
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
