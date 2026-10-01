import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Layers,
  CalendarCheck,
  Calendar,
  FileBarChart,
  ShieldCheck,
  Bell,
  UserCheck
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <aside className="sidebar">
      {isAdmin ? (
        <>
          <div className="sidebar-heading">Admin Portal</div>
          <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users size={18} />
            <span>User Accounts</span>
          </NavLink>
          <NavLink to="/admin/resources" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Layers size={18} />
            <span>Campus Resources</span>
          </NavLink>
          <NavLink to="/admin/bookings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <CalendarCheck size={18} />
            <span>All Bookings</span>
          </NavLink>
          <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <FileBarChart size={18} />
            <span>Reports & Analytics</span>
          </NavLink>
          <NavLink to="/admin/audit" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ShieldCheck size={18} />
            <span>Audit Logs</span>
          </NavLink>

          <div className="sidebar-heading" style={{ marginTop: '12px' }}>General</div>
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <UserCheck size={18} />
            <span>Admin Profile</span>
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bell size={18} />
            <span>Notifications</span>
          </NavLink>
        </>
      ) : (
        <>
          <div className="sidebar-heading">Campus Workspace</div>
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>My Dashboard</span>
          </NavLink>
          <NavLink to="/resources" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Layers size={18} />
            <span>Campus Resources</span>
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Calendar size={18} />
            <span>Booking Calendar</span>
          </NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <CalendarCheck size={18} />
            <span>My Bookings</span>
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bell size={18} />
            <span>Notifications</span>
          </NavLink>

          <div className="sidebar-heading" style={{ marginTop: '12px' }}>Account</div>
          <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <UserCheck size={18} />
            <span>My Profile</span>
          </NavLink>
        </>
      )}
    </aside>
  );
};
