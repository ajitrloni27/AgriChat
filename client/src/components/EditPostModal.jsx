import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Save, AlertCircle, Edit3 } from 'lucide-react';
import API from '../services/api';

const CATEGORIES = [
  'General',
  'Crops',
  'Pest Control',
  'Weather',
  'Market Prices',
  'Govt Schemes',
  'Machinery',
];

const EditPostModal = ({ isOpen, onClose, post, onPostUpdated }) => {
  const { user, language } = useAuth();
  const isKannada = language === 'kn';

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    crop: '',
    image: '',
    tags: '',
    isAnnouncement: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        category: post.category || 'General',
        crop: post.crop || '',
        image: post.image || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
        isAnnouncement: post.isAnnouncement || false,
      });
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      setError(isKannada ? 'ದಯವಿಟ್ಟು ಪೋಸ್ಟ್ ವಿವರವನ್ನು ನಮೂದಿಸಿ' : 'Please provide post content');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await API.put(`/posts/${post._id}`, formData);
      if (res.data.success) {
        onPostUpdated(res.data.post);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 color="#15803d" size={20} />
            <h3>{isKannada ? 'ಪೋಸ್ಟ್ ಸಂಪಾದಿಸಿ' : 'Edit Post'}</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಶೀರ್ಷಿಕೆ' : 'Post Title'}</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Category & Crop Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{isKannada ? 'ವರ್ಗ' : 'Category'}</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field select-field"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{isKannada ? 'ಬೆಳೆ' : 'Crop'}</label>
                <input
                  type="text"
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Content */}
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ವಿವರಣೆ *' : 'Post Content *'}</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="input-field"
                rows="4"
                required
              />
            </div>

            {/* Image URL */}
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಚಿತ್ರ URL' : 'Image URL'}</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಟ್ಯಾಗ್‌ಗಳು' : 'Tags (comma separated)'}</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Announcement checkbox for Admin/Expert */}
            {(user?.role === 'admin' || user?.role === 'expert') && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: '#fefce8',
                  border: '1px solid #fde047',
                  borderRadius: '12px',
                  marginTop: '0.5rem',
                }}
              >
                <input
                  type="checkbox"
                  id="editIsAnnouncement"
                  name="isAnnouncement"
                  checked={formData.isAnnouncement}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="editIsAnnouncement" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#854d0e', cursor: 'pointer' }}>
                  ⭐ {isKannada ? 'ಅಧಿಕೃತ ಪ್ರಕಟಣೆಯಾಗಿ ಪಿನ್ ಮಾಡಿ' : 'Pin as Official Community Announcement'}
                </label>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              {isKannada ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              <span>{loading ? (isKannada ? 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...' : 'Saving...') : (isKannada ? 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ' : 'Save Changes')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
