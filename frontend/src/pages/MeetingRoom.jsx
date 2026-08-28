import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useWebRTC from '../hooks/useWebRTC';
import VideoCall from '../components/VideoCall';
import VideoControls from '../components/VideoControls';
import Participants from '../components/Participants';
import api from '../services/api';

const MeetingRoom = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [meetingError, setMeetingError] = useState('');

  const {
    localVideoRef,
    remoteVideoRef,
    status,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
    stopMedia,
  } = useWebRTC(roomId);

  useEffect(() => {
    api.get(`/meetings/${roomId}`)
      .then(({ data }) => setMeeting(data))
      .catch(() => setMeetingError('Meeting not found'));
  }, [roomId]);

  const handleLeave = () => {
    stopMedia();
    navigate('/dashboard');
  };

  if (meetingError) {
    return (
      <div className="meeting-error">
        <h2>⚠️ {meetingError}</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="meeting-room">
      <div className="meeting-top-bar">
        <div>
          <h2 className="meeting-title">{meeting?.title || 'Loading...'}</h2>
          <span className="meeting-room-id">Room: {roomId}</span>
        </div>
        <Participants status={status} userName={user?.name} />
      </div>

      <VideoCall
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        status={status}
        isCameraOff={isCameraOff}
      />

      <VideoControls
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onToggleMute={toggleMute}
        onToggleCamera={toggleCamera}
        onLeave={handleLeave}
      />
    </div>
  );
};

export default MeetingRoom;
