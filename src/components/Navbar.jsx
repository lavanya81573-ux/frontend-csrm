import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Building2, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <Building2 size={24} color="#3b82f6" />
        <span>CSRM Campus</span>
        <span className="navbar-badge">v1.0</span>
      </Link>

      <nav className="navbar-nav">
        {isAuthenticated ? (
          <>
            <NotificationDropdown />

            <div className="user-pill">
              <UserIcon size={14} color="#94a3b8" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.username}</span>
              <span className={`user-pill-role role-badge-${user?.role}`}>
                {user?.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{
                background: '#1e293b',
                color: '#f87171',
                borderColor: '#334155',
                padding: '6px 12px'
              }}
              title="Sign Out"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
};
