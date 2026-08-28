import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Video Calls, <span className="highlight">Simplified</span>
          </h1>
          <p className="hero-subtitle">
            Connect with anyone, anywhere. Free, real-time video conferencing powered by WebRTC.
            No downloads, no plugins — just open your browser and start a call.
          </p>
          <div className="hero-actions">
            {user ? (
              <>
                <Link to="/create-meeting" className="btn btn-primary btn-lg">Start a Meeting</Link>
                <Link to="/join-meeting" className="btn btn-outline btn-lg">Join a Meeting</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-video-mock">
              <div className="mock-screen">📹</div>
              <div className="mock-controls">
                <span>🎤</span><span>📷</span><span>📞</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <span className="feature-icon">⚡</span>
          <h3>Instant Meetings</h3>
          <p>Create a room in seconds and share the link with anyone.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🔒</span>
          <h3>Peer-to-Peer</h3>
          <p>Video and audio travel directly between participants via WebRTC.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🌐</span>
          <h3>No Downloads</h3>
          <p>Works entirely in the browser. Nothing to install.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
