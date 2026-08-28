const VideoCall = ({ localVideoRef, remoteVideoRef, status, isCameraOff }) => {
  return (
    <div className="video-grid">
      {/* Remote video — main area */}
      <div className="video-remote-wrapper">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="video-remote"
        />
        {status !== 'connected' && (
          <div className="video-overlay">
            <div className="video-overlay-text">
              {status === 'waiting' && '⏳ Waiting for participant...'}
              {status === 'connecting' && '🔄 Connecting...'}
              {status === 'left' && '👋 Participant left the call'}
            </div>
          </div>
        )}
      </div>

      {/* Local video — preview */}
      <div className="video-local-wrapper">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="video-local"
        />
        {isCameraOff && (
          <div className="video-local-off">
            <span>📷 Camera Off</span>
          </div>
        )}
        <span className="video-local-label">You</span>
      </div>
    </div>
  );
};

export default VideoCall;
