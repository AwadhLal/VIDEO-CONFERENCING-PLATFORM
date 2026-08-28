import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-content">
          <h1>Video Meetings, <span className="highlight">Simplified</span></h1>
          <p className="hero-subtitle">
            Connect face-to-face with crystal-clear video and audio. No downloads required.
            Powered by WebRTC for real peer-to-peer communication.
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
          <div className="video-mockup">
            <div className="mockup-screen">🎥</div>
            <div className="mockup-pip">👤</div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <span className="feature-icon">🔒</span>
          <h3>Secure</h3>
          <p>End-to-end peer-to-peer WebRTC connections with JWT authentication.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⚡</span>
          <h3>Real-time</h3>
          <p>Instant signaling with Socket.IO for low-latency connections.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🌐</span>
          <h3>No Plugins</h3>
          <p>Works directly in modern browsers. No downloads or extensions needed.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
