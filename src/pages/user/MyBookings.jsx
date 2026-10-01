import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Edit2,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modify Modal state
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modifyDate, setModifyDate] = useState('');
  const [modifyStartTime, setModifyStartTime] = useState('');
  const [modifyEndTime, setModifyEndTime] = useState('');
  const [modifyPurpose, setModifyPurpose] = useState('');
  const [modifying, setModifying] = useState(false);
  const [modifyError, setModifyError] = useState('');

  // Cancel Confirmation Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      setErrorMsg('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openModifyModal = (booking) => {
    setSelectedBooking(booking);
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    // Format local date YYYY-MM-DD
    const dateStr = start.toISOString().split('T')[0];
    const startHours = String(start.getHours()).padStart(2, '0');
    const startMins = String(start.getMinutes()).padStart(2, '0');
    const endHours = String(end.getHours()).padStart(2, '0');
    const endMins = String(end.getMinutes()).padStart(2, '0');

    setModifyDate(dateStr);
    setModifyStartTime(`${startHours}:${startMins}`);
    setModifyEndTime(`${endHours}:${endMins}`);
    setModifyPurpose(booking.purpose || '');
    setModifyError('');
    setModifyModalOpen(true);
  };

  const handleModifySubmit = async (e) => {
    e.preventDefault();
    setModifyError('');
    setModifying(true);

    try {
      const newStart = `${modifyDate}T${modifyStartTime}:00`;
      const newEnd = `${modifyDate}T${modifyEndTime}:00`;

      if (new Date(newEnd) <= new Date(newStart)) {
        setModifyError('End time must be after start time.');
        setModifying(false);
        return;
      }

      await bookingService.updateBooking(selectedBooking.id, {
        startTime: newStart,
        endTime: newEnd,
        purpose: modifyPurpose
      });

      setSuccessMsg('Booking modified successfully! Conflict detection verified.');
      setModifyModalOpen(false);
      fetchBookings();
    } catch (err) {
      setModifyError(err.friendlyMessage || 'Failed to modify booking. Slot may conflict.');
    } finally {
      setModifying(false);
    }
  };

  const openCancelModal = (booking) => {
    setCancellingBooking(booking);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancellingBooking) return;
    setCancelling(true);

    try {
      await bookingService.cancelBooking(cancellingBooking.id);
      setSuccessMsg(`Booking for ${cancellingBooking.resourceName} was cancelled successfully. The slot is now available again.`);
      setCancelModalOpen(false);
      fetchBookings();
    } catch (err) {
      setErrorMsg(err.friendlyMessage || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching your bookings..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>My Bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Review, modify or cancel your scheduled campus facility reservations
          </p>
        </div>

        <Link to="/calendar" className="btn btn-primary">
          <Plus size={16} />
          <span>New Booking</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <div>{errorMsg}</div>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <div>{successMsg}</div>
        </div>
      )}

      <div className="card">
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <h3>No bookings found</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>You haven't made any campus bookings yet.</p>
            <Link to="/resources" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Browse Available Facilities
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Resource</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Purpose</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const isCancelled = b.status === 'CANCELLED';
                  const startDate = new Date(b.startTime);
                  const endDate = new Date(b.endTime);

                  return (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{b.id}</td>
                      <td style={{ fontWeight: 600 }}>{b.resourceName}</td>
                      <td>
                        <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 500 }}>
                          {b.resourceType}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} color="var(--text-muted)" />
                          <span>{b.location}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                          {startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td style={{ fontSize: '0.85rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={b.purpose}>
                        {b.purpose || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => openModifyModal(b)}
                            disabled={isCancelled}
                            className="btn btn-secondary btn-sm"
                            title={isCancelled ? 'Cancelled bookings cannot be modified' : 'Modify booking schedule'}
                            style={{ opacity: isCancelled ? 0.4 : 1 }}
                          >
                            <Edit2 size={13} />
                            <span>Modify</span>
                          </button>

                          <button
                            onClick={() => openCancelModal(b)}
                            disabled={isCancelled}
                            className="btn btn-danger btn-sm"
                            title={isCancelled ? 'Already cancelled' : 'Cancel this reservation'}
                            style={{ opacity: isCancelled ? 0.4 : 1 }}
                          >
                            <XCircle size={13} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modify Booking Modal */}
      <Modal
        isOpen={modifyModalOpen}
        onClose={() => setModifyModalOpen(false)}
        title={selectedBooking ? `Modify Booking #${selectedBooking.id}` : 'Modify Booking'}
      >
        {selectedBooking && (
          <form onSubmit={handleModifySubmit}>
            {modifyError && (
              <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                <div>{modifyError}</div>
              </div>
            )}

            <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div><strong>Facility:</strong> {selectedBooking.resourceName} ({selectedBooking.resourceType})</div>
              <div><strong>Location:</strong> {selectedBooking.location}</div>
            </div>

            <div className="form-group">
              <label className="form-label">New Reservation Date</label>
              <input
                type="date"
                className="form-control"
                min={new Date().toISOString().split('T')[0]}
                value={modifyDate}
                onChange={(e) => setModifyDate(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={modifyStartTime}
                  onChange={(e) => setModifyStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={modifyEndTime}
                  onChange={(e) => setModifyEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Purpose</label>
              <textarea
                className="form-control"
                value={modifyPurpose}
                onChange={(e) => setModifyPurpose(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModifyModalOpen(false)}
                disabled={modifying}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={modifying}
              >
                {modifying ? 'Validating Conflicts...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Cancellation"
        maxWidth="440px"
      >
        {cancellingBooking && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                display: 'inline-flex',
                padding: '12px',
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                borderRadius: '50%',
                marginBottom: '12px'
              }}>
                <XCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Cancel this reservation?</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Are you sure you want to cancel booking <strong>#{cancellingBooking.id}</strong> for <strong>{cancellingBooking.resourceName}</strong>?
                This time slot will immediately become available for other campus users.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCancelModalOpen(false)}
                disabled={cancelling}
              >
                Keep Booking
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancelConfirm}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
