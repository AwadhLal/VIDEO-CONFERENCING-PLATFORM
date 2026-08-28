const Participants = ({ status, userName }) => {
  const statusMap = {
    waiting: { text: 'Waiting for others to join...', color: '#f59e0b' },
    connecting: { text: 'Connecting...', color: '#3b82f6' },
    connected: { text: 'Connected', color: '#10b981' },
    left: { text: 'Participant left', color: '#ef4444' },
  };

  const current = statusMap[status] || statusMap.waiting;

  return (
    <div className="participants-panel">
      <h3>Meeting Info</h3>
      <div className="participant-item">
        <span className="participant-dot" style={{ background: '#10b981' }}></span>
        <span>{userName} (You)</span>
      </div>
      <div className="connection-status" style={{ color: current.color }}>
        ● {current.text}
      </div>
    </div>
  );
};

export default Participants;
