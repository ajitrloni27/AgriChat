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
  Send,
  CornerDownRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import API from '../services/api';

const PostCard = ({ post, onEdit, onDelete, setActiveTab }) => {
  const { user, isAuthenticated, language } = useAuth();
  const isKannada = language === 'kn';

  // Like state (Optimistic)
  const currentUserId = user?.id || user?._id;
  const initialLiked = user && post.likes?.some((id) => (id._id || id).toString() === currentUserId);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || post.likes?.length || 0);
  const [heartAnim, setHeartAnim] = useState(false);

  // Comment state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // General state
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const authorId = (post.author?._id || post.author)?.toString();
  const isOwner = user && (authorId === currentUserId || user.role === 'admin');

  // Handle Like Toggle (Optimistic)
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      setActiveTab('login');
      return;
    }

    const nextLiked = !isLiked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    // Optimistic UI update
    setIsLiked(nextLiked);
    setLikesCount(nextCount);
    if (nextLiked) {
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 350);
    }

    try {
      const res = await API.put(`/posts/${post._id}/like`);
      if (res.data.success) {
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
      }
    } catch (err) {
      console.error('Like toggle error:', err);
      // Rollback on failure
      setIsLiked(!nextLiked);
      setLikesCount(likesCount);
    }
  };

  // Fetch comments
  const toggleCommentsSection = async () => {
    const nextState = !showComments;
    setShowComments(nextState);

    if (nextState && !commentsLoaded) {
      setCommentsLoading(true);
      try {
        const res = await API.get(`/posts/${post._id}/comments`);
        if (res.data.success) {
          setComments(res.data.comments);
          setCommentsCount(res.data.count);
          setCommentsLoaded(true);
        }
      } catch (err) {
        console.error('Fetch comments error:', err);
      } finally {
        setCommentsLoading(false);
      }
    }
  };

  // Submit new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setActiveTab('login');
      return;
    }
    if (!newCommentText.trim()) return;

    setCommentSubmitting(true);
    try {
      const res = await API.post(`/posts/${post._id}/comments`, {
        text: newCommentText.trim(),
      });
      if (res.data.success) {
        setComments((prev) => [...prev, res.data.comment]);
        setCommentsCount((prev) => prev + 1);
        setNewCommentText('');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to post comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    const confirmMsg = isKannada
      ? 'ಈ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?'
      : 'Are you sure you want to delete this comment?';
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await API.delete(`/comments/${commentId}`);
      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        setCommentsCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete comment');
    }
  };

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
          {/* Real-time Like Button */}
          <button
            className={`action-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLikeToggle}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart
              size={17}
              color="#ef4444"
              fill={isLiked ? '#ef4444' : 'none'}
              className={heartAnim ? 'heart-pop' : ''}
            />
            <span style={{ fontWeight: 700 }}>{likesCount}</span>
          </button>

          {/* Comment Count / Drawer Toggle */}
          <button
            className={`action-btn ${showComments ? 'active' : ''}`}
            onClick={toggleCommentsSection}
            title="Toggle Comments"
            style={{ background: showComments ? '#e0f2fe' : '#f8fafc', color: showComments ? '#0369a1' : 'var(--text-muted)' }}
          >
            <MessageCircle size={17} color="#0284c7" />
            <span>
              {commentsCount} {isKannada ? 'ಪ್ರತಿಕ್ರಿಯೆಗಳು' : 'Comments'}
            </span>
          </button>
        </div>

        {/* Share / Copy Link */}
        <button className="action-btn" onClick={handleShare} title="Share Link">
          {copied ? <Check size={16} color="#16a34a" /> : <Share2 size={16} />}
          <span>{copied ? (isKannada ? 'ನಕಲಿಸಲಾಗಿದೆ!' : 'Copied!') : (isKannada ? 'ಹಂಚಿಕೊಳ್ಳಿ' : 'Share')}</span>
        </button>
      </div>

      {/* Day 6: Real-Time Inline Comments Drawer */}
      {showComments && (
        <div className="comments-section">
          <div className="comments-header">
            <CornerDownRight size={16} color="var(--primary)" />
            <span>{isKannada ? 'ರೈತರ ಪ್ರತಿಕ್ರಿಯೆಗಳು & ಸಲಹೆಗಳು' : 'Farmer Responses & Advice'}</span>
          </div>

          {/* Comment Composer */}
          <form className="comment-composer" onSubmit={handleAddComment}>
            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
              {user?.profilePic && user.profilePic.length <= 4 ? (
                user.profilePic
              ) : user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                '👨‍🌾'
              )}
            </div>
            <div className="comment-input-box">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={
                  isAuthenticated
                    ? isKannada
                      ? 'ನಿಮ್ಮ ಸಲಹೆ ಅಥವಾ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಬರೆಯಿರಿ...'
                      : 'Share agricultural advice or reply to this farmer...'
                    : isKannada
                    ? 'ಪ್ರತಿಕ್ರಿಯಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ...'
                    : 'Sign in to write a comment...'
                }
                className="comment-input"
              />
              <button
                type="submit"
                className="comment-submit-btn"
                disabled={commentSubmitting || !newCommentText.trim()}
                title="Post Comment"
              >
                <Send size={14} />
              </button>
            </div>
          </form>

          {/* Comments List */}
          {commentsLoading ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <RefreshCw size={18} className="spin-icon" style={{ margin: '0 auto 0.5rem', color: 'var(--primary)' }} />
              <p>{isKannada ? 'ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading discussion...'}</p>
            </div>
          ) : comments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', padding: '0.75rem 0' }}>
              {isKannada
                ? 'ಇನ್ನೂ ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆಗಳಿಲ್ಲ. ಮೊದಲ ಸಲಹೆ ನೀಡಿ!'
                : 'No replies yet. Be the first farmer or expert to offer advice!'}
            </p>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => {
                const commentAuthorId = (comment.author?._id || comment.author)?.toString();
                const canDelete =
                  user &&
                  (commentAuthorId === currentUserId ||
                    authorId === currentUserId ||
                    user.role === 'admin');

                const commentDate = comment.createdAt
                  ? new Date(comment.createdAt).toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                return (
                  <div key={comment._id} className="comment-item">
                    <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '0.75rem' }}>
                      {comment.author?.profilePic && comment.author.profilePic.length <= 4 ? (
                        comment.author.profilePic
                      ) : comment.author?.name ? (
                        comment.author.name.charAt(0).toUpperCase()
                      ) : (
                        '🌾'
                      )}
                    </div>
                    <div className="comment-bubble">
                      <div className="comment-bubble-header">
                        <div>
                          <span className="comment-author-name">{comment.author?.name || 'Farmer'}</span>
                          <span className={`role-tag role-${comment.author?.role || 'farmer'}`} style={{ fontSize: '0.65rem' }}>
                            {comment.author?.role === 'admin'
                              ? '🛡️ Admin'
                              : comment.author?.role === 'expert'
                              ? '🎓 Expert'
                              : '🌾 Farmer'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="comment-time">{commentDate}</span>
                          {canDelete && (
                            <button
                              className="comment-delete-btn"
                              onClick={() => handleDeleteComment(comment._id)}
                              title="Delete Comment"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default PostCard;
