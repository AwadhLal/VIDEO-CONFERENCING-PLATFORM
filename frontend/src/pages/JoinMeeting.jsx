import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const JoinMeeting = () => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const id = roomId.trim();
    if (!id) return setError('Please enter a Room ID');

    setLoading(true);
    try {
      await api.get(`/meetings/${id}`);
      navigate(`/meeting/${id}`);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Meeting not found. Check the Room ID and try again.');
      } else {
        setError('Failed to join meeting');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Join a Meeting</h2>
        <p className="auth-subtitle">Enter a Room ID to join an existing call</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Paste the room ID here"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Joining...' : 'Join Meeting'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinMeeting;
