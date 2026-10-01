import React, { useState, useEffect } from 'react';
import { resourceService } from '../../services/resourceService';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Search,
  MapPin
} from 'lucide-react';

export const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Resource Form Modal (for Add / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CLASSROOM',
    location: '',
    availability: 'AVAILABLE',
    description: '',
    capacity: 1
  });
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [typeFilter, setTypeFilter] = useState('');
  const [availFilter, setAvailFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getResources({
        type: typeFilter || undefined,
        availability: availFilter || undefined,
        search: searchQuery || undefined
      });
      setResources(data || []);
    } catch (err) {
      setErrorMsg('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [typeFilter, availFilter]);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      type: 'CLASSROOM',
      location: '',
      availability: 'AVAILABLE',
      description: '',
      capacity: 30
    });
    setModalOpen(true);
  };

  const openEditModal = (res) => {
    setIsEditing(true);
    setCurrentId(res.id);
    setFormData({
      name: res.name,
      type: res.type,
      location: res.location,
      availability: res.availability,
      description: res.description || '',
      capacity: res.capacity || 1
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      if (isEditing) {
        await resourceService.updateResource(currentId, formData);
        setSuccessMsg(`Resource "${formData.name}" updated successfully.`);
      } else {
        await resourceService.createResource(formData);
        setSuccessMsg(`New resource "${formData.name}" registered successfully.`);
      }
      setModalOpen(false);
      fetchResources();
    } catch (err) {
      setErrorMsg(err.friendlyMessage || 'Failed to save resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (res) => {
    if (!window.confirm(`Are you sure you want to delete resource "${res.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await resourceService.deleteResource(res.id);
      setSuccessMsg(`Resource "${res.name}" was deleted successfully.`);
      fetchResources();
    } catch (err) {
      setErrorMsg(err.friendlyMessage || 'Failed to delete resource.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading campus facilities catalog..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Resource Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Add, update, calibrate, and maintain campus classrooms, labs, lockers, and equipment
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Resource</span>
        </button>
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

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '38px' }}
              placeholder="Search resource name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchResources()}
            />
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              className="form-control"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="CLASSROOM">Classroom</option>
              <option value="LAB">Lab</option>
              <option value="LOCKER">Smart Locker</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              className="form-control"
              value={availFilter}
              onChange={(e) => setAvailFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNAVAILABLE">Unavailable</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          <button onClick={fetchResources} className="btn btn-secondary">
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Resource Name</th>
                <th>Category</th>
                <th>Campus Location</th>
                <th>Capacity</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{r.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.description}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 600 }}>
                      {r.type}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} color="var(--text-muted)" />
                      <span>{r.location}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{r.capacity} pax</td>
                  <td>
                    <StatusBadge status={r.availability} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(r)}
                        className="btn btn-secondary btn-sm"
                        title="Edit Resource"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(r)}
                        className="btn btn-danger btn-sm"
                        title="Delete Resource"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Resource Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? `Edit Resource #${currentId}` : 'Add Campus Resource'}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Resource Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Auditorium Hall B, Robotics Kit #2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Resource Type</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="CLASSROOM">CLASSROOM</option>
                <option value="LAB">LAB</option>
                <option value="LOCKER">LOCKER</option>
                <option value="EQUIPMENT">EQUIPMENT</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Availability Status</label>
              <select
                className="form-control"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                required
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Campus Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Science Block, Room 204"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Capacity (persons)</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description & Amenities</label>
            <textarea
              className="form-control"
              placeholder="Describe equipment specifications, projector availability, network ports, etc..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Resource' : 'Create Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
