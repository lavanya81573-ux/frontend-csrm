import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      setSuccess('Registration request submitted! Your account status is PENDING administrator approval. Once an admin approves your request, you can log in.');
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      setError(err.friendlyMessage || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '32px' }}>
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Create Account</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Register as a Student or Faculty member to book campus facilities
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              {success}
              <div style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                Redirecting to login in 5 seconds... <Link to="/login" style={{ fontWeight: 600, textDecoration: 'underline' }}>Go to Login now</Link>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name / Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="e.g. anita_sharma"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Campus Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="e.g. anita@university.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Campus Role</label>
            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="STUDENT">Student (Lockers, Labs, Equipment)</option>
              <option value="FACULTY">Faculty (Classrooms, Labs, Equipment)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '11px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : (
              <>
                <UserPlus size={18} />
                <span>Submit Registration</span>
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
