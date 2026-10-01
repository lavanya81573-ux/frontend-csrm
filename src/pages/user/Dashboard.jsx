import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { resourceService } from '../../services/resourceService';
import { notificationService } from '../../services/notificationService';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Calendar,
  Layers,
  Clock,
  Bell,
  ArrowRight,
  PlusCircle,
  MapPin
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [myBookings, resList, unread] = await Promise.all([
          bookingService.getMyBookings(),
          resourceService.getResources(),
          notificationService.getUnreadCount()
        ]);
        setBookings(myBookings || []);
        setResources(resList || []);
        setUnreadNotifs(unread || 0);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your campus workspace..." />;

  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const availableResources = resources.filter(r => r.availability === 'AVAILABLE');

  return (
    <div>
      {/* Welcome Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Welcome back, {user?.username}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            CSRM Workspace &bull; Role: <strong style={{ color: 'var(--text-main)' }}>{user?.role}</strong> &bull; Status: <StatusBadge status={user?.status} />
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/calendar" className="btn btn-primary">
            <Calendar size={16} />
            <span>Booking Calendar</span>
          </Link>
          <Link to="/resources" className="btn btn-secondary">
            <Layers size={16} />
            <span>Explore Resources</span>
          </Link>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-value">{activeBookings.length}</div>
            <div className="stat-label">Active Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <Layers size={24} />
          </div>
          <div>
            <div className="stat-value">{availableResources.length}</div>
            <div className="stat-label">Available Facilities</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-value">{bookings.length}</div>
            <div className="stat-label">Total Reservations</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-yellow">
            <Bell size={24} />
          </div>
          <div>
            <div className="stat-value">{unreadNotifs}</div>
            <div className="stat-label">Unread Notifications</div>
          </div>
        </div>
      </div>

      {/* Grid: Upcoming Bookings & Quick Book Facilities */}
      <div className="grid-2">
        {/* Upcoming Reservations */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Upcoming Reservations</h2>
              <p className="card-subtitle">Your active scheduled campus slots</p>
            </div>
            <Link to="/my-bookings" className="btn btn-secondary btn-sm">
              View All ({bookings.length})
            </Link>
          </div>

          {activeBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
              <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>You have no active bookings at the moment.</p>
              <Link to="/calendar" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                Book a Resource Now
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeBookings.slice(0, 4).map(b => (
                <div key={b.id} style={{
                  padding: '14px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{b.resourceName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={12} /> {b.location} &bull; {b.resourceType}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginTop: '4px' }}>
                      {new Date(b.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} &bull; {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Facilities */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Campus Resources</h2>
              <p className="card-subtitle">Browse and reserve classrooms, labs, lockers & equipment</p>
            </div>
            <Link to="/resources" className="btn btn-secondary btn-sm">
              Explore All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <Link to="/resources?type=CLASSROOM" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                padding: '16px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: '#faf5ff',
                textAlign: 'center',
                transition: 'transform 0.15s'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🏛️</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Classrooms</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auditoriums & Halls</div>
              </div>
            </Link>

            <Link to="/resources?type=LAB" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                padding: '16px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: '#eff6ff',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🔬</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Labs</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI, Robotics & IT</div>
              </div>
            </Link>

            <Link to="/resources?type=LOCKER" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                padding: '16px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: '#ecfdf5',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🔐</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Smart Lockers</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RFID Library & Sports</div>
              </div>
            </Link>

            <Link to="/resources?type=EQUIPMENT" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                padding: '16px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: '#fffbeb',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🎥</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Equipment</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cameras, 3D Printers</div>
              </div>
            </Link>
          </div>

          <div style={{ marginTop: '20px', padding: '14px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              💡 <strong>Conflict-Free Scheduling:</strong> CSRM automatically checks time-slot overlaps to prevent double bookings. If your selected slot conflicts, you will be notified immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
