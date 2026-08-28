import { useNavigate } from 'react-router-dom';

const VideoControls = ({ isMuted, isCameraOff, onToggleMute, onToggleCamera, onLeave }) => {
  return (
    <div className="video-controls">
      <button
        className={`ctrl-btn ${isMuted ? 'ctrl-btn-off' : ''}`}
        onClick={onToggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🎤'}
        <span>{isMuted ? 'Unmute' : 'Mute'}</span>
      </button>

      <button
        className={`ctrl-btn ${isCameraOff ? 'ctrl-btn-off' : ''}`}
        onClick={onToggleCamera}
        title={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
      >
        {isCameraOff ? '📷' : '📹'}
        <span>{isCameraOff ? 'Start Video' : 'Stop Video'}</span>
      </button>

      <button className="ctrl-btn ctrl-btn-leave" onClick={onLeave} title="Leave meeting">
        📞 <span>Leave</span>
      </button>
    </div>
  );
};

export default VideoControls;
