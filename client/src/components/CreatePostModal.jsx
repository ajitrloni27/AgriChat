import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Image, Sparkles, Tag, Shield, Send, AlertCircle, Sprout } from 'lucide-react';
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

const CROP_SUGGESTIONS = ['Cotton', 'Paddy', 'Arecanut', 'Maize', 'Sugarcane', 'Tomato', 'Chilli', 'Wheat'];

const SAMPLE_IMAGES = [
  { label: '🌿 Crop Field', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=60' },
  { label: '🚜 Tractor', url: 'https://images.unsplash.com/photo-1589876735235-9f5b6ca61c39?w=800&auto=format&fit=crop&q=60' },
  { label: '🐛 Plant Health', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?w=800&auto=format&fit=crop&q=60' },
  { label: '🍅 Fresh Harvest', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=60' },
];

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
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

  if (!isOpen) return null;

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
      const res = await API.post('/posts', formData);
      if (res.data.success) {
        onPostCreated(res.data.post);
        onClose();
        setFormData({
          title: '',
          content: '',
          category: 'General',
          crop: '',
          image: '',
          tags: '',
          isAnnouncement: false,
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sprout color="#15803d" size={22} />
            <h3>{isKannada ? 'ಹೊಸ ಕೃಷಿ ಪೋಸ್ಟ್ ರಚಿಸಿ' : 'Create Community Post'}</h3>
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
              <label className="form-label">{isKannada ? 'ಶೀರ್ಷಿಕೆ (ಐಚ್ಛಿಕ)' : 'Post Title (Optional)'}</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder={isKannada ? 'ಉದಾ: ಹತ್ತಿ ಬೆಳೆಯಲ್ಲಿ ಗುಲಾಬಿ ಕಾಯಿಕೊರೆಯುವ ಹುಳು ಸಮಸ್ಯೆ' : 'e.g. Pink Bollworm alert on Cotton'}
              />
            </div>

            {/* Category & Crop Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{isKannada ? 'ವರ್ಗ (Category)' : 'Category'}</label>
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
                <label className="form-label">{isKannada ? 'ಬೆಳೆ (Target Crop)' : 'Crop (Optional)'}</label>
                <input
                  type="text"
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Cotton / Paddy"
                />
              </div>
            </div>

            {/* Crop Quick Suggestion Pills */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center' }}>
                {isKannada ? 'ತ್ವರಿತ ಬೆಳೆಗಳು:' : 'Quick Crops:'}
              </span>
              {CROP_SUGGESTIONS.map((cropName) => (
                <button
                  type="button"
                  key={cropName}
                  onClick={() => setFormData({ ...formData, crop: cropName })}
                  style={{
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: '9999px',
                    border: '1px solid #e2e8f0',
                    background: formData.crop === cropName ? '#dcfce7' : '#f8fafc',
                    color: formData.crop === cropName ? '#15803d' : '#475569',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {cropName}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಪೋಸ್ಟ್ ವಿವರಣೆ *' : 'Post Content *'}</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="input-field"
                rows="4"
                required
                placeholder={
                  isKannada
                    ? 'ನಿಮ್ಮ ಕೃಷಿ ಸಮಸ್ಯೆ ಅಥವಾ ಸಲಹೆಯನ್ನು ವಿವರವಾಗಿ ಬರೆಯಿರಿ...'
                    : 'Describe your question, pest issue, weather observation, or farming advice in detail...'
                }
              />
            </div>

            {/* Image URL & Quick Sample Photos */}
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಚಿತ್ರ URL (ಐಚ್ಛಿಕ)' : 'Image URL (Optional)'}</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input-field"
                placeholder="https://..."
              />
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', alignSelf: 'center' }}>
                  {isKannada ? 'ಮಾದರಿ ಚಿತ್ರಗಳು:' : 'Sample Photos:'}
                </span>
                {SAMPLE_IMAGES.map((img) => (
                  <button
                    type="button"
                    key={img.label}
                    onClick={() => setFormData({ ...formData, image: img.url })}
                    style={{
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: formData.image === img.url ? '#dcfce7' : '#ffffff',
                      color: formData.image === img.url ? '#166534' : '#334155',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">{isKannada ? 'ಟ್ಯಾಗ್‌ಗಳು (ಅಲ್ಪವಿರಾಮದಿಂದ ಬೇರ್ಪಡಿಸಿ)' : 'Tags (comma separated)'}</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Organic, Fertilizer, Kharif2026"
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
                  id="isAnnouncement"
                  name="isAnnouncement"
                  checked={formData.isAnnouncement}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isAnnouncement" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#854d0e', cursor: 'pointer' }}>
                  ⭐ {isKannada ? 'ಅಧಿಕೃತ ಪ್ರಕಟಣೆಯಾಗಿ ಪಿನ್ ಮಾಡಿ (Pin as Official Announcement)' : 'Pin as Official Community Announcement'}
                </label>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              {isKannada ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={16} />
              <span>{loading ? (isKannada ? 'ಪ್ರಕಟಿಸಲಾಗುತ್ತಿದೆ...' : 'Publishing...') : (isKannada ? 'ಪೋಸ್ಟ್ ಮಾಡಿ' : 'Publish Post')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
