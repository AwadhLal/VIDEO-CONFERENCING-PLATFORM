import { useEffect, useRef, useState, useCallback } from 'react';
import socket from '../services/socket';

// Free public STUN server for development
// NOTE: In production with strict NAT/firewall environments, a TURN server is required.
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const useWebRTC = (roomId) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  const [status, setStatus] = useState('idle'); // idle | waiting | connecting | connected | left
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState(null);

  // Create a new RTCPeerConnection
  const createPeerConnection = useCallback((targetSocketId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local tracks to the connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // When we receive a remote track, display it
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setStatus('connected');
      }
    };

    // Send ICE candidates to the remote peer via signaling server
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { candidate: event.candidate, to: targetSocketId });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setStatus('left');
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, []);

  // Cleanup peer connection
  const closePeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, []);

  // Stop all local media tracks
  const stopLocalStream = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (!roomId) return;

    let mounted = true;

    const init = async () => {
      try {
        // Get local camera and mic
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Connect socket and join room
        socket.connect();
        socket.emit('join-room', roomId);
        setStatus('waiting');

        // Another user joined — we initiate the offer
        socket.on('user-joined', async ({ socketId }) => {
          if (!mounted) return;
          setRemoteSocketId(socketId);
          setStatus('connecting');

          const pc = createPeerConnection(socketId);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('offer', { offer, to: socketId });
        });

        // We received an offer — send back an answer
        socket.on('offer', async ({ offer, from }) => {
          if (!mounted) return;
          setRemoteSocketId(from);
          setStatus('connecting');

          const pc = createPeerConnection(from);
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', { answer, to: from });
        });

        // We received an answer
        socket.on('answer', async ({ answer }) => {
          if (!mounted) return;
          if (peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          }
        });

        // Received an ICE candidate from the remote peer
        socket.on('ice-candidate', async ({ candidate }) => {
          if (!mounted) return;
          try {
            if (peerConnectionRef.current) {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
          } catch (err) {
            console.error('Error adding ICE candidate:', err);
          }
        });

        // Remote user left
        socket.on('user-left', () => {
          if (!mounted) return;
          closePeerConnection();
          setRemoteSocketId(null);
          setStatus('left');
        });
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setStatus('idle');
      }
    };

    init();

    return () => {
      mounted = false;
      socket.emit('leave-room', roomId);
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
      socket.disconnect();
      closePeerConnection();
      stopLocalStream();
    };
  }, [roomId, createPeerConnection, closePeerConnection, stopLocalStream]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff((prev) => !prev);
    }
  };

  return {
    localVideoRef,
    remoteVideoRef,
    status,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
  };
};

export default useWebRTC;
