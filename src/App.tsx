import React, { useState, useEffect, FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppData } from './types';
import Splash from './components/Splash';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import MultiSubjectLeaderboard from './components/MultiSubjectLeaderboard';
import { subscribeToData } from './lib/dataService';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeView, setActiveView] = useState<'global' | 'local'>('global');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const handleAdminClick = () => {
    if (isAdminMode) return;
    setShowPasswordModal(true);
    setPasswordInput('');
    setError('');
  };

  const verifyPassword = (e?: FormEvent) => {
    e?.preventDefault();
    if (passwordInput === '29306') {
      setIsAdminMode(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setError('');
    } else {
      setError('Incorrect password');
      setPasswordInput('');
    }
  };

  const [data, setData] = useState<AppData>({
    students: [],
    marks: [],
    subjects: [],
    groups: []
  });

  useEffect(() => {
    const unsubscribe = subscribeToData((newData) => {
      setData(newData);
    });

    return () => unsubscribe();
  }, []);

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <AnimatePresence mode="wait">
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <header className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-10">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold truncate">Ambition Plus</h1>
                  {!isAdminMode && (
                    <div className="hidden sm:flex items-center gap-1 bg-white/10 p-1 rounded-lg ml-4">
                      <button
                        onClick={() => setActiveView('global')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${activeView === 'global' ? 'bg-white text-blue-600' : 'hover:bg-white/10 text-white/80'}`}
                      >
                        GLOBAL
                      </button>
                      <button
                        onClick={() => setActiveView('local')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${activeView === 'local' ? 'bg-white text-blue-600' : 'hover:bg-white/10 text-white/80'}`}
                      >
                        LOCAL
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-white/10 p-1 rounded-lg">
                  <button
                    onClick={() => setIsAdminMode(false)}
                    className={`px-3 py-1 rounded text-sm transition-all ${!isAdminMode ? 'bg-white text-blue-600 shadow-sm' : 'hover:bg-white/10'}`}
                  >
                    Viewer
                  </button>
                  <button
                    onClick={handleAdminClick}
                    className={`px-3 py-1 rounded text-sm transition-all ${isAdminMode ? 'bg-white text-blue-600 shadow-sm' : 'hover:bg-white/10'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>
              {!isAdminMode && (
                <div className="sm:hidden flex mt-3 items-center gap-2 bg-white/10 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveView('global')}
                    className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${activeView === 'global' ? 'bg-white text-blue-600 shadow-sm' : 'hover:bg-white/10 text-white/80'}`}
                  >
                    GLOBAL LEADERBOARD
                  </button>
                  <button
                    onClick={() => setActiveView('local')}
                    className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${activeView === 'local' ? 'bg-white text-blue-600 shadow-sm' : 'hover:bg-white/10 text-white/80'}`}
                  >
                    LOCAL RESULTS
                  </button>
                </div>
              )}
            </header>

            <main className="max-w-7xl mx-auto p-4">
              {isAdminMode ? (
                <AdminDashboard data={data} />
              ) : activeView === 'global' ? (
                <MultiSubjectLeaderboard />
              ) : (
                <StudentDashboard data={data} user={null} />
              )}
            </main>

            {/* Password Modal */}
            <AnimatePresence>
              {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
                  >
                    <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Admin Access</h3>
                    <form onSubmit={verifyPassword} className="space-y-4">
                      <div>
                        <input
                          autoFocus
                          type="password"
                          placeholder="Enter Admin Password"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
                            error ? 'border-red-500 bg-red-50 text-red-900' : 'border-slate-100 focus:border-blue-500'
                          }`}
                        />
                        {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowPasswordModal(false)}
                          className="flex-1 px-4 py-2 text-slate-500 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                        >
                          Unlock
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
  );
}
