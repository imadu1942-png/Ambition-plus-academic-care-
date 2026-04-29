import { useState, useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { AnimatePresence, motion } from 'motion/react';
import { User, AppData, Role } from './types';
import Splash from './components/Splash';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ambition_plus_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [data, setData] = useState<AppData>({
    students: [],
    marks: [],
    subjects: [],
    groups: []
  });
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('initial_data', (initialData: AppData) => {
      setData(initialData);
    });

    newSocket.on('data_updated', (updatedData: AppData) => {
      setData(updatedData);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('ambition_plus_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ambition_plus_user');
  };

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <Login onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <header className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-10">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold truncate">Ambition Plus</h1>
                <div className="flex items-center gap-4">
                  <span className="text-sm opacity-80 hidden sm:inline">
                    Logged in as {user.username} ({user.role})
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto p-4">
              {user.role === 'admin' ? (
                <AdminDashboard data={data} socket={socket} />
              ) : (
                <StudentDashboard data={data} user={user} />
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
