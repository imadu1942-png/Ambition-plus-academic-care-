import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, BookOpen, GraduationCap, Laptop, TrendingUp, Search } from 'lucide-react';
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
    loadData(activeSubject);
  }, [activeSubject]);

  const baseData = useMemo(() => {
    let list = subjectData[activeSubject] || [];
    // Filter out creator name
    return list.filter(item => !item.name.toLowerCase().includes('imad uddin'));
  }, [subjectData, activeSubject]);

  const mainListData = useMemo(() => {
    if (!searchQuery) return baseData;
    return baseData.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [baseData, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return { 
      bg: 'bg-amber-500', 
      text: 'text-white', 
      border: 'border-amber-500', 
      card: 'bg-amber-50/50 border-amber-200',
      accent: 'text-amber-600'
    };
    if (index === 1) return { 
      bg: 'bg-slate-400', 
      text: 'text-white', 
      border: 'border-slate-400', 
      card: 'bg-slate-50/50 border-slate-200',
      accent: 'text-slate-500'
    };
    if (index === 2) return { 
      bg: 'bg-orange-700', 
      text: 'text-white', 
      border: 'border-orange-700', 
      card: 'bg-orange-50/20 border-orange-200',
      accent: 'text-orange-700'
    };
    return { 
      bg: 'bg-slate-100', 
      text: 'text-slate-600', 
      border: 'border-slate-100', 
      card: 'bg-white border-slate-100',
      accent: 'text-blue-600'
    };
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8 px-4">
      {/* Header & Tabs */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Academic Exam Leaderboard
              <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-200">Global</div>
            </h2>
            <p className="text-slate-400 text-sm font-medium">Real-time academic excellence tracking system</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Finding a scholar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none text-sm transition-all focus:bg-white focus:border-blue-200 font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {SUBJECTS.map((sub) => {
            const Icon = sub.icon;
            const isActive = activeSubject === sub.key;
            return (
              <button
                key={sub.key}
                onClick={() => setActiveSubject(sub.key)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all relative overflow-hidden group ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105 z-10' 
                    : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/20' : sub.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">{sub.key}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Unified List Section */}
      {loading[activeSubject] && subjectData[activeSubject].length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm gap-4">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-black uppercase tracking-[0.2em]">Syncing Intelligence...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Academic Rankings</h3>
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Participants {activeSubject}</div>
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={activeSubject + searchQuery}
              className="grid grid-cols-1 gap-4"
            >
              {mainListData.length > 0 ? (
                mainListData.map((record) => {
                  const globalRank = baseData.findIndex(s => s.name === record.name);
                  const styles = getRankStyle(globalRank);
                  const isTopThree = globalRank < 3;
                  
                  return (
                    <motion.div
                      layout
                      variants={itemVariants}
                      key={`${record.name}-${globalRank}`}
                      className={`p-4 md:p-6 rounded-[2rem] border transition-all group flex items-center gap-4 md:gap-6 ${styles.card} ${isTopThree ? 'shadow-xl shadow-slate-200/50 scale-[1.02] border-opacity-50' : 'shadow-sm hover:shadow-lg'}`}
                    >
                      {/* Rank Indicator */}
                      <div className={`shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-black text-lg md:text-2xl transition-all group-hover:scale-110 shadow-sm ${styles.bg} ${styles.text}`}>
                        {globalRank + 1}
                      </div>

                      {/* Name and Trophy Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h5 className={`font-black tracking-tight group-hover:text-blue-600 transition-colors text-base md:text-xl truncate ${isTopThree ? 'text-slate-900' : 'text-slate-700'}`}>
                          {record.name}
                        </h5>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
                             {globalRank === 0 ? 'Prime Scholar' : globalRank === 1 ? 'Silver Medalist' : globalRank === 2 ? 'Bronze Medalist' : 'Global Participant'}
                           </span>
                           {globalRank < 10 && <div className={`shrink-0 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse ${globalRank === 0 ? 'bg-amber-500' : 'bg-blue-500'}`} />}
                        </div>
                      </div>

                      {/* Score Section */}
                      <div className="flex items-center gap-4 md:gap-8 shrink-0">
                        <div className="hidden lg:block w-32 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${Math.min((record.marks / 100) * 100, 100)}%` }}
                             className={`h-full ${globalRank === 0 ? 'bg-amber-500' : globalRank === 1 ? 'bg-slate-400' : globalRank === 2 ? 'bg-orange-600' : 'bg-blue-500'}`}
                           />
                        </div>
                        <div className={`text-2xl md:text-5xl font-black italic tracking-tighter tabular-nums ${globalRank === 0 ? 'text-amber-600' : globalRank === 1 ? 'text-slate-500' : globalRank === 2 ? 'text-orange-900' : 'text-slate-900'}`}>
                          {record.marks}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-200 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-slate-400 text-sm font-black uppercase tracking-[0.2em]">Zero scholars match your query</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <footer className="pt-8 pb-12 flex flex-col md:flex-row justify-between items-center gap-6 px-4">
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-500">{baseData.length} TOTAL Scholars</span>
              {loading[activeSubject] && <div className="flex items-center gap-2 text-blue-500"><div className="w-1 h-1 bg-current rounded-full animate-ping"/> SYNCING LIVE...</div>}
            </div>
            
            <button 
              onClick={() => loadData(activeSubject)}
              className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 hover:text-blue-600 hover:border-blue-200 uppercase tracking-[0.2em] transition-all hover:shadow-lg active:scale-95 shadow-sm"
              disabled={loading[activeSubject]}
            >
              <RefreshCw className={`w-4 h-4 ${loading[activeSubject] ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} /> 
              Re-Sync Matrix
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}

