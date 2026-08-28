import VideoControls from './VideoControls';
import Participants from './Participants';
import useWebRTC from '../hooks/useWebRTC';
import { useAuth } from '../context/AuthContext';

const VideoCall = ({ roomId, meetingTitle }) => {
  const { user } = useAuth();
  const {
    localVideoRef,
    remoteVideoRef,
    status,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
  } = useWebRTC(roomId);

  return (
    <div className="meeting-room">
      {/* Header */}
      <div className="meeting-header">
        <span className="meeting-title">🎥 {meetingTitle || 'Meeting Room'}</span>
        <span className="room-id-badge">Room: {roomId}</span>
      </div>

      {/* Video area */}
      <div className="video-area">
        {/* Remote video - main view */}
        <div className="remote-video-wrapper">
          <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
          {status !== 'connected' && (
            <div className="video-overlay">
              <div className="overlay-content">
                {status === 'waiting' && (
                  <>
                    <div className="spinner"></div>
                    <p>Waiting for someone to join...</p>
                    <small>Share the Room ID to invite others</small>
                  </>
                )}
                {status === 'connecting' && (
                  <>
                    <div className="spinner"></div>
                    <p>Connecting...</p>
                  </>
                )}
                {status === 'left' && (
                  <>
                    <p>👋 Participant left the meeting</p>
                  </>
                )}
                {status === 'idle' && (
                  <>
                    <div className="spinner"></div>
                    <p>Setting up your camera...</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Local video - picture-in-picture */}
        <div className="local-video-wrapper">
          <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
          <span className="local-label">You</span>
        </div>
      </div>

      {/* Sidebar */}
      <div className="meeting-sidebar">
        <Participants status={status} userName={user?.name} />
      </div>

      {/* Controls */}
      <VideoControls
        isMuted={isMuted}
        isCameraOff={isCameraOff}
        onToggleMute={toggleMute}
        onToggleCamera={toggleCamera}
      />
    </div>
  );
};

export default VideoCall;
