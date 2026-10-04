import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Edit2,
  Trash2,
  MapPin,
  Sparkles,
  Pin,
  Check,
} from 'lucide-react';
import API from '../services/api';

const PostCard = ({ post, onEdit, onDelete, setActiveTab }) => {
  const { user, language } = useAuth();
  const isKannada = language === 'kn';

  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const authorId = post.author?._id || post.author;
  const isOwner = user && (authorId === user.id || authorId === user._id || user.role === 'admin');

  const handleDelete = async () => {
    const confirmText = isKannada
      ? 'ಈ ಪೋಸ್ಟ್ ಅನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?'
      : 'Are you sure you want to delete this post?';
    if (!window.confirm(confirmText)) return;

    setDeleteLoading(true);
    try {
      const res = await API.delete(`/posts/${post._id}`);
      if (res.data.success) {
        onDelete(post._id);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete post');
    } finally {
      setDeleteLoading(false);
      setShowMenu(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/#post-${post._id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <article className={`post-card ${post.isAnnouncement ? 'announcement-card' : ''}`} id={`post-${post._id}`}>
      {/* Pinned Announcement Badge */}
      {post.isAnnouncement && (
        <div className="announcement-banner">
          <Pin size={13} />
          <span>{isKannada ? 'ಅಧಿಕೃತ ಕೃಷಿ ಪ್ರಕಟಣೆ' : 'Official Announcement'}</span>
        </div>
      )}

      {/* Header: Author & Controls */}
      <div className="post-header">
        <div className="author-info">
          <div className="avatar">
            {post.author?.profilePic && post.author.profilePic.length <= 4 ? (
              post.author.profilePic
            ) : post.author?.profilePic ? (
              <img src={post.author.profilePic} alt="Avatar" className="profile-avatar-img" />
            ) : post.author?.name ? (
              post.author.name.charAt(0).toUpperCase()
            ) : (
              '🌾'
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                {post.author?.name || 'Farmer'}
              </span>
              <span className={`role-tag role-${post.author?.role || 'farmer'}`}>
                {post.author?.role === 'admin'
                  ? '🛡️ Admin'
                  : post.author?.role === 'expert'
                  ? '🎓 Expert'
                  : '🌾 Farmer'}
              </span>
            </div>
            <div className="post-meta">
              {(post.location?.village || post.author?.village || post.location?.district || post.author?.district) && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <MapPin size={12} />
                  {post.location?.village || post.author?.village ? `${post.location?.village || post.author?.village}, ` : ''}
                  {post.location?.district || post.author?.district}
                </span>
              )}
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Actions Dropdown for Owner / Admin */}
        {isOwner && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '6px',
              }}
              title="Post Options"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  background: '#ffffff',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.4rem',
                  zIndex: 20,
                  minWidth: '130px',
                }}
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(post);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.45rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    borderRadius: '6px',
                    textAlign: 'left',
                  }}
                >
                  <Edit2 size={14} />
                  <span>{isKannada ? 'ಸಂಪಾದಿಸಿ' : 'Edit Post'}</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.45rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    color: '#dc2626',
                    borderRadius: '6px',
                    textAlign: 'left',
                  }}
                >
                  <Trash2 size={14} />
                  <span>{isKannada ? 'ಅಳಿಸಿ' : 'Delete Post'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Badges: Category & Target Crop */}
      <div className="post-badges">
        {post.category && (
          <span className="category-badge">
            🏷️ {post.category}
          </span>
        )}
        {post.crop && (
          <span className="crop-badge">
            🌱 {post.crop}
          </span>
        )}
      </div>

      {/* Title */}
      {post.title && <h3 className="post-title">{post.title}</h3>}

      {/* Content */}
      <p className="post-content">{post.content}</p>

      {/* Attached Image */}
      {post.image && (
        <div className="post-image-container">
          <img src={post.image} alt={post.title || 'Agri Post'} className="post-image" loading="lazy" />
        </div>
      )}

      {/* Hashtag Pills */}
      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="tag-pill">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Footer */}
      <div className="post-actions">
        <div className="action-btn-group">
          {/* Like button (Visual count in Day 5, real-time social toggle in Day 6) */}
          <button className="action-btn" title="Likes">
            <Heart size={16} color="#ef4444" fill={post.likes?.length > 0 ? '#ef4444' : 'none'} />
            <span>{post.likesCount || post.likes?.length || 0}</span>
          </button>

          {/* Comment Count */}
          <button className="action-btn" title="Comments">
            <MessageCircle size={16} color="#3b82f6" />
            <span>{post.commentsCount || 0} {isKannada ? 'ಪ್ರತಿಕ್ರಿಯೆಗಳು' : 'Comments'}</span>
          </button>
        </div>

        {/* Share / Copy Link */}
        <button className="action-btn" onClick={handleShare} title="Share Link">
          {copied ? <Check size={16} color="#16a34a" /> : <Share2 size={16} />}
          <span>{copied ? (isKannada ? 'ನಕಲಿಸಲಾಗಿದೆ!' : 'Copied!') : (isKannada ? 'ಹಂಚಿಕೊಳ್ಳಿ' : 'Share')}</span>
        </button>
      </div>
    </article>
  );
};

export default PostCard;
