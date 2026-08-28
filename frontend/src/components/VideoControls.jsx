import { useNavigate } from 'react-router-dom';

const VideoControls = ({ isMuted, isCameraOff, onToggleMute, onToggleCamera }) => {
  const navigate = useNavigate();

  return (
    <div className="video-controls">
      <button
        className={`control-btn ${isMuted ? 'control-btn-off' : ''}`}
        onClick={onToggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🎤'}
        <span>{isMuted ? 'Unmute' : 'Mute'}</span>
      </button>

      <button
        className={`control-btn ${isCameraOff ? 'control-btn-off' : ''}`}
        onClick={onToggleCamera}
        title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
      >
        {isCameraOff ? '📷' : '📹'}
        <span>{isCameraOff ? 'Start Video' : 'Stop Video'}</span>
      </button>

      <button
        className="control-btn control-btn-leave"
        onClick={() => navigate('/dashboard')}
        title="Leave meeting"
      >
        📞
        <span>Leave</span>
      </button>
    </div>
  );
};

export default VideoControls;
