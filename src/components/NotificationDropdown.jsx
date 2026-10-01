import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count || 0);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, readStatus: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, readStatus: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifs();
        }}
        style={{
          background: 'none',
          border: 'none',
          color: '#cbd5e1',
          cursor: 'pointer',
          position: 'relative',
          padding: '6px',
          display: 'flex',
          alignItems: 'center'
        }}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            background: '#ef4444',
            color: '#fff',
            borderRadius: '9999px',
            fontSize: '0.65rem',
            fontWeight: '700',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #0f172a'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 150 }}
            onClick={() => setIsOpen(false)}
          />
          <div className="notif-dropdown">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc'
            }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 500
                  }}
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                No notifications right now
              </div>
            ) : (
              <div>
                {notifications.slice(0, 6).map((notif) => (
                  <div
                    key={notif.id}
                    className={`notif-item ${!notif.readStatus ? 'unread' : ''}`}
                    onClick={(e) => !notif.readStatus && handleMarkAsRead(notif.id, e)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{ margin: 0, color: notif.readStatus ? '#475569' : '#0f172a', fontWeight: notif.readStatus ? 400 : 600 }}>
                        {notif.message}
                      </p>
                      {!notif.readStatus && (
                        <button
                          onClick={(e) => handleMarkAsRead(notif.id, e)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#059669',
                            cursor: 'pointer',
                            padding: '2px',
                            marginLeft: '8px'
                          }}
                          title="Mark as read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                    <div className="notif-time">
                      {new Date(notif.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}

                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px',
                    fontSize: '0.8rem',
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontWeight: 500,
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0'
                  }}
                >
                  View all notifications →
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
