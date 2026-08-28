import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateMeeting from './pages/CreateMeeting';
import JoinMeeting from './pages/JoinMeeting';
import MeetingRoom from './pages/MeetingRoom';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Meeting room has its own full-screen layout */}
        <Route
          path="/meeting/:roomId"
          element={
            <ProtectedRoute>
              <MeetingRoom />
            </ProtectedRoute>
          }
        />
        {/* All other pages share the Navbar layout */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/dashboard"
                    element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                  />
                  <Route
                    path="/create-meeting"
                    element={<ProtectedRoute><CreateMeeting /></ProtectedRoute>}
                  />
                  <Route
                    path="/join-meeting"
                    element={<ProtectedRoute><JoinMeeting /></ProtectedRoute>}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
