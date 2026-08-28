import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/meetings')
      .then(({ data }) => setMeetings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const copyLink = (roomId) => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomId}`);
    alert('Meeting link copied!');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Manage your meetings from here.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/create-meeting" className="btn btn-primary">+ New Meeting</Link>
          <Link to="/join-meeting" className="btn btn-outline">Join Meeting</Link>
        </div>
      </div>

      <div className="meetings-section">
        <h2>Your Meetings</h2>
        {loading ? (
          <p className="loading-text">Loading meetings...</p>
        ) : meetings.length === 0 ? (
          <div className="empty-state">
            <span>📅</span>
            <p>No meetings yet. Create one to get started.</p>
            <Link to="/create-meeting" className="btn btn-primary">Create Meeting</Link>
          </div>
        ) : (
          <div className="meetings-grid">
            {meetings.map((m) => (
              <div key={m._id} className="meeting-card">
                <div className="meeting-card-header">
                  <h3>{m.title}</h3>
                  <span className="meeting-id">ID: {m.roomId}</span>
                </div>
                <p className="meeting-date">
                  {new Date(m.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </p>
                <div className="meeting-card-actions">
                  <Link to={`/meeting/${m.roomId}`} className="btn btn-primary btn-sm">Join</Link>
                  <button onClick={() => copyLink(m.roomId)} className="btn btn-outline btn-sm">
                    Copy Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
