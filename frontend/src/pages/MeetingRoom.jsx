import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoCall from '../components/VideoCall';
import api from '../services/api';

const MeetingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const { data } = await api.get(`/meetings/${roomId}`);
        setMeeting(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Meeting room not found.');
        } else {
          setError('Failed to load meeting.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMeeting();
  }, [roomId]);

  if (loading) {
    return (
      <div className="page centered">
        <div className="spinner"></div>
        <p>Loading meeting room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page centered">
        <div className="empty-state">
          <span>❌</span>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <VideoCall roomId={roomId} meetingTitle={meeting?.title} />;
};

export default MeetingRoom;
