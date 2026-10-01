import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(usernameOrEmail, password);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }
    } catch (err) {
      setError(err.friendlyMessage || 'Invalid credentials or account issue.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setUsernameOrEmail('admin');
      setPassword('Password@123');
    } else if (role === 'faculty') {
      setUsernameOrEmail('faculty');
      setPassword('Password@123');
    } else if (role === 'student') {
      setUsernameOrEmail('student');
      setPassword('Password@123');
    } else if (role === 'pending') {
      setUsernameOrEmail('rahul_kumar');
      setPassword('Password@123');
    }
    setError('');
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            background: 'var(--primary-light)',
            borderRadius: '50%',
            marginBottom: '12px'
          }}>
            <Building2 size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Welcome to CSRM</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Sign in to manage and reserve campus resources
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. admin or faculty@csrm.com"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '11px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Quick Demo Autofill:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemo('admin')}
            >
              👑 Admin Demo
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemo('faculty')}
            >
              🎓 Faculty Demo
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemo('student')}
            >
              🎒 Student Demo
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemo('pending')}
              title="Test pending account approval block"
            >
              ⏳ Pending User
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
