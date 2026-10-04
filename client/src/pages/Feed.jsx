import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  PlusCircle,
  TrendingUp,
  CloudRain,
  Sprout,
  Filter,
  RefreshCw,
  AlertCircle,
  Megaphone,
  MapPin,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import API from '../services/api';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import EditPostModal from '../components/EditPostModal';

const CATEGORIES = [
  'All',
  'Crops',
  'Pest Control',
  'Weather',
  'Market Prices',
  'Govt Schemes',
  'Machinery',
  'General',
];

const KARNATAKA_DISTRICTS = [
  'All Districts',
  'Gadag',
  'Dharwad',
  'Belagavi',
  'Uttara Kannada',
  'Mandya',
  'Haveri',
  'Shivamogga',
  'Ballari',
  'Bengaluru Urban',
];

const Feed = ({ setActiveTab }) => {
  const { user, isAuthenticated, language } = useAuth();
  const isKannada = language === 'kn';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (selectedDistrict && selectedDistrict !== 'All Districts') {
        params.district = selectedDistrict;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (sortBy) {
        params.sort = sortBy;
      }

      const res = await API.get('/posts', { params });
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error('Fetch posts error:', err);
      setError(err.response?.data?.error || 'Failed to load community feed');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedDistrict, searchQuery, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  return (
    <div className="container">
      <div className="feed-layout">
        {/* Main Feed Column */}
        <main>
          {/* Create Post Prompt Card */}
          <div className="create-post-card">
            <div className="create-post-trigger">
              <div className="avatar">
                {user?.profilePic && user.profilePic.length <= 4 ? (
                  user.profilePic
                ) : user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  '👨‍🌾'
                )}
              </div>
              <button
                className="create-post-input"
                onClick={() => {
                  if (!isAuthenticated) {
                    setActiveTab('login');
                  } else {
                    setIsCreateOpen(true);
                  }
                }}
              >
                {isAuthenticated
                  ? isKannada
                    ? `${user?.name || 'ರೈತರೇ'}, ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆ ಅಥವಾ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ...`
                    : `What's happening on your farm, ${user?.name || 'Farmer'}? Share advice or ask a question...`
                  : isKannada
                  ? 'ಪೋಸ್ಟ್ ಮಾಡಲು ಲಾಗಿನ್ ಆಗಿ...'
                  : 'Sign in to post crop questions, pest alerts & updates...'}
              </button>
            </div>

            <div className="create-post-actions">
              <button
                className="quick-action-btn"
                onClick={() => (isAuthenticated ? setIsCreateOpen(true) : setActiveTab('login'))}
              >
                <Sprout size={17} color="#16a34a" />
                <span>{isKannada ? 'ಬೆಳೆ ಪ್ರಶ್ನೆ' : 'Ask Crop Question'}</span>
              </button>
              <button
                className="quick-action-btn"
                onClick={() => (isAuthenticated ? setIsCreateOpen(true) : setActiveTab('login'))}
              >
                <AlertCircle size={17} color="#ea580c" />
                <span>{isKannada ? 'ಕೀಟ ಎಚ್ಚರಿಕೆ' : 'Pest Alert'}</span>
              </button>
              {(user?.role === 'admin' || user?.role === 'expert') && (
                <button
                  className="quick-action-btn"
                  onClick={() => setIsCreateOpen(true)}
                  style={{ color: '#854d0e' }}
                >
                  <Megaphone size={17} color="#eab308" />
                  <span>{isKannada ? 'ಪ್ರಕಟಣೆ' : 'Announcement'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="category-filter-bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' && '🌾'}
                {cat === 'Crops' && '🌱'}
                {cat === 'Pest Control' && '🐛'}
                {cat === 'Weather' && '🌧️'}
                {cat === 'Market Prices' && '💰'}
                {cat === 'Govt Schemes' && '🏛️'}
                {cat === 'Machinery' && '🚜'}
                {cat === 'General' && '💬'}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* Feed Controls: Search & Sort */}
          <div className="feed-controls">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isKannada
                    ? 'ಬೆಳೆ, ಕೀಟ, ಬೆಲೆ ಅಥವಾ ಸ್ಥಳ ಹುಡುಕಿ...'
                    : 'Search discussions, crops, pests, prices or tags...'
                }
                className="search-input"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field select-field"
              style={{ width: '160px', padding: '0.65rem 1rem' }}
            >
              <option value="newest">{isKannada ? 'ಹೊಸದು (Newest)' : 'Newest First'}</option>
              <option value="popular">{isKannada ? 'ಜನಪ್ರಿಯ (Popular)' : 'Most Liked'}</option>
              <option value="oldest">{isKannada ? 'ಹಳೆಯದು (Oldest)' : 'Oldest First'}</option>
            </select>

            <button
              className="btn btn-outline"
              onClick={fetchPosts}
              title="Refresh Feed"
              style={{ padding: '0.65rem 0.85rem' }}
            >
              <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Posts List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <RefreshCw size={32} className="spin-icon" style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
              <p>{isKannada ? 'ಕೃಷಿ ಫೀಡ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : 'Loading agricultural community feed...'}</p>
            </div>
          ) : posts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3.5rem 1.5rem',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px dashed #cbd5e1',
              }}
            >
              <Sprout size={48} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {isKannada ? 'ಯಾವುದೇ ಪೋಸ್ಟ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No Community Posts Found'}
              </h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                {isKannada
                  ? 'ಈ ವರ್ಗದಲ್ಲಿ ಮೊದಲ ಪೋಸ್ಟ್ ಪ್ರಕಟಿಸುವವರಾಗಿ ಅಥವಾ ನಿಮ್ಮ ಹುಡುಕಾಟ ಪದವನ್ನು ಬದಲಾಯಿಸಿ.'
                  : 'Be the first farmer to share a post in this category or adjust your search filters.'}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => (isAuthenticated ? setIsCreateOpen(true) : setActiveTab('login'))}
              >
                <PlusCircle size={18} />
                <span>{isKannada ? 'ಮೊದಲ ಪೋಸ್ಟ್ ರಚಿಸಿ' : 'Create First Post'}</span>
              </button>
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onEdit={(p) => setEditingPost(p)}
                  onDelete={handlePostDeleted}
                  setActiveTab={setActiveTab}
                />
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar Widgets */}
        <aside>
          {/* District Filter Widget */}
          <div className="widget-card">
            <h4 className="widget-title">
              <MapPin size={18} color="#16a34a" />
              <span>{isKannada ? 'ಜಿಲ್ಲೆಗಳ ಪ್ರಕಾರ ಫಿಲ್ಟರ್' : 'Filter by District'}</span>
            </h4>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="input-field select-field"
            >
              {KARNATAKA_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* MSP & Market Rates Widget */}
          <div className="widget-card" style={{ background: 'linear-gradient(180deg, #ecfdf5 0%, #ffffff 50%)' }}>
            <h4 className="widget-title" style={{ color: '#047857' }}>
              <TrendingUp size={18} />
              <span>{isKannada ? 'ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು' : 'Mandis & Market Rates'}</span>
            </h4>
            <div style={{ fontSize: '0.85rem' }}>
              <div className="info-item">
                <span className="info-label">🌾 BT Cotton (Gadag)</span>
                <span className="info-value">₹7,450 / Qtl</span>
              </div>
              <div className="info-item">
                <span className="info-label">🌽 Maize (Dharwad)</span>
                <span className="info-value">₹2,150 / Qtl</span>
              </div>
              <div className="info-item">
                <span className="info-label">🍅 Tomato (Kolar)</span>
                <span className="info-value">₹1,800 / Qtl</span>
              </div>
              <div className="info-item">
                <span className="info-label">🌴 Arecanut (Sirsi)</span>
                <span className="info-value">₹48,200 / Qtl</span>
              </div>
            </div>
          </div>

          {/* Monsoon & Weather Alert Widget */}
          <div className="widget-card" style={{ background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 50%)' }}>
            <h4 className="widget-title" style={{ color: '#1d4ed8' }}>
              <CloudRain size={18} />
              <span>{isKannada ? 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ' : 'Agri Weather Alert'}</span>
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
              🌧️ {isKannada
                ? 'ಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ ಉತ್ತರ ಕರ್ನಾಟಕ ಮತ್ತು ಕರಾವಳಿ ಭಾಗದಲ್ಲಿ ಸಾಧಾರಣ ಮಳೆಯ ಮುನ್ಸೂಚನೆ ಇದೆ.'
                : 'Scattered moderate rainfall expected across North Karnataka & Coastal districts over the next 48 hours.'}
            </p>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={!!editingPost}
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  );
};

export default Feed;
