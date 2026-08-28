const Participants = ({ status, userName }) => {
  const statusText = {
    idle: 'Setting up...',
    waiting: 'Waiting for participant to join...',
    connecting: 'Connecting...',
    connected: 'Connected',
    left: 'Participant left the meeting',
  };

  return (
    <div className="participants-panel">
      <h3>Meeting Info</h3>
      <div className={`status-badge status-${status}`}>
        {statusText[status] || 'Unknown'}
      </div>
      <div className="participant-item">
        <span className="participant-dot"></span>
        <span>{userName} (You)</span>
      </div>
      {status === 'connected' && (
        <div className="participant-item">
          <span className="participant-dot"></span>
          <span>Remote Participant</span>
        </div>
      )}
    </div>
  );
};

export default Participants;
