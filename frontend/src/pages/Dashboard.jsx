import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { data } = await api.get('/meetings');
        setMeetings(data);
      } catch (err) {
        console.error('Failed to fetch meetings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const copyRoomId = (roomId) => {
    navigator.clipboard.writeText(roomId);
    alert(`Room ID "${roomId}" copied to clipboard!`);
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <p className="text-muted">Manage your meetings below</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/create-meeting" className="btn btn-primary">+ New Meeting</Link>
          <Link to="/join-meeting" className="btn btn-outline">Join Meeting</Link>
        </div>
      </div>

      <div className="meetings-section">
        <h2>Your Meetings</h2>
        {loading ? (
          <div className="loading">Loading meetings...</div>
        ) : meetings.length === 0 ? (
          <div className="empty-state">
            <span>📅</span>
            <p>No meetings yet. Create your first one!</p>
            <Link to="/create-meeting" className="btn btn-primary">Create Meeting</Link>
          </div>
        ) : (
          <div className="meetings-grid">
            {meetings.map((meeting) => (
              <div key={meeting._id} className="meeting-card">
                <div className="meeting-card-header">
                  <h3>{meeting.title}</h3>
                  <span className="room-id-badge">{meeting.roomId}</span>
                </div>
                <p className="text-muted">
                  Created {new Date(meeting.createdAt).toLocaleDateString()}
                </p>
                <div className="meeting-card-actions">
                  <Link to={`/meeting/${meeting.roomId}`} className="btn btn-primary btn-sm">
                    Join
                  </Link>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => copyRoomId(meeting.roomId)}
                  >
                    Copy ID
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
