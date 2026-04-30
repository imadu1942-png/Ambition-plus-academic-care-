import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, Award, RefreshCw, BookOpen, GraduationCap, Laptop, TrendingUp, Search } from 'lucide-react';
import { fetchSubjectData, SubjectRecord, SubjectKey } from '../services/multiSheetService';

const SUBJECTS: { key: SubjectKey; icon: any; color: string }[] = [
  { key: 'Bangla', icon: BookOpen, color: 'text-rose-600 bg-rose-50' },
  { key: 'English', icon: GraduationCap, color: 'text-blue-600 bg-blue-50' },
  { key: 'ICT', icon: Laptop, color: 'text-emerald-600 bg-emerald-50' },
  { key: 'Economics', icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
];

export default function MultiSubjectLeaderboard() {
  const [activeSubject, setActiveSubject] = useState<SubjectKey>('Bangla');
  const [subjectData, setSubjectData] = useState<Record<SubjectKey, SubjectRecord[]>>({
    Bangla: [],
    English: [],
    ICT: [],
    Economics: []
  });
  const [loading, setLoading] = useState<Record<SubjectKey, boolean>>({
    Bangla: false,
    English: false,
    ICT: false,
    Economics: false
  });
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async (subject: SubjectKey) => {
    setLoading(prev => ({ ...prev, [subject]: true }));
    const data = await fetchSubjectData(subject);
    setSubjectData(prev => ({ ...prev, [subject]: data }));
    setLoading(prev => ({ ...prev, [subject]: false }));
  };

  useEffect(() => {
    // Initial load for all or lazy load? Let's lazy load as user clicks but fetch first one
    loadData(activeSubject);
  }, [activeSubject]);

  const currentData = useMemo(() => {
    const list = subjectData[activeSubject] || [];
    if (!searchQuery) return list;
    return list.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [subjectData, activeSubject, searchQuery]);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-slate-400" />;
    if (index === 2) return <Award className="w-5 h-5 text-amber-700" />;
    return null;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8">
      {/* Header & Tabs */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Performance Leaderboard
              <div className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Global</div>
            </h2>
            <p className="text-slate-500 text-sm font-medium">Tracking excellence across multiple disciplines</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none text-sm transition-all focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SUBJECTS.map((sub) => {
            const Icon = sub.icon;
            const isActive = activeSubject === sub.key;
            return (
              <button
                key={sub.key}
                onClick={() => setActiveSubject(sub.key)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all relative overflow-hidden group ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20' : sub.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">{sub.key}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Section */}
      {loading[activeSubject] && subjectData[activeSubject].length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-black uppercase tracking-[0.2em]">Syncing {activeSubject} Results...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubject}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Position</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                    <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentData.length > 0 ? (
                    currentData.map((record, index) => (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(index * 0.02, 1) }}
                        key={`${record.name}-${index}`}
                        className={`group hover:bg-slate-50/80 transition-all ${index < 3 ? 'bg-blue-50/20' : ''}`}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm transition-all group-hover:rotate-3 ${
                              index === 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 
                              index === 1 ? 'bg-slate-400 text-white shadow-lg shadow-slate-100' :
                              index === 2 ? 'bg-orange-700 text-white shadow-lg shadow-orange-100' :
                              'text-slate-900 bg-slate-100'
                            }`}>
                              {index + 1}
                            </span>
                            {getRankIcon(index)}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{record.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Academic Record</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-2xl font-black italic tracking-tighter ${
                              index === 0 ? 'text-amber-600' : 
                              index === 1 ? 'text-slate-500' :
                              index === 2 ? 'text-orange-900' :
                              'text-slate-900'
                            }`}>
                              {record.marks}
                            </span>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((record.marks / 100) * 100, 100)}%` }}
                                className={`h-full ${index < 3 ? 'bg-amber-400' : 'bg-slate-900'}`}
                              />
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-8 py-24 text-center">
                         <div className="flex flex-col items-center gap-4 opacity-10">
                            <Search className="w-16 h-16" />
                            <p className="text-lg font-black uppercase tracking-[0.2em]">No Matches Found</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>{currentData.length} Students listed in {activeSubject}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                {loading[activeSubject] && <span className="text-blue-500 animate-pulse">Syncing...</span>}
              </div>
              <button 
                onClick={() => loadData(activeSubject)}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
                disabled={loading[activeSubject]}
              >
                <RefreshCw className={`w-3 h-3 ${loading[activeSubject] ? 'animate-spin' : ''}`} /> RELOAD DATA
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
