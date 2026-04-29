import { useState, useMemo } from 'react';
import { AppData, Student, Mark, User } from '../types';
import { Trophy, Medal, Star, Calendar, Filter, Hash, Users } from 'lucide-react';
import { isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';

interface StudentDashboardProps {
  data: AppData;
  user: User;
}

type TimeFrame = 'all' | 'daily' | 'weekly' | 'monthly';

export default function StudentDashboard({ data, user }: StudentDashboardProps) {
  const [activeSubject, setActiveSubject] = useState<string>('Overall');
  const [activeGroup, setActiveGroup] = useState<string>('All Groups');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('all');

  const rankings = useMemo(() => {
    // 1. Filter marks by time frame
    const filteredMarks = data.marks.filter(mark => {
      const date = parseISO(mark.timestamp);
      if (timeFrame === 'daily') return isToday(date);
      if (timeFrame === 'weekly') return isThisWeek(date, { weekStartsOn: 6 }); 
      if (timeFrame === 'monthly') return isThisMonth(date);
      return true;
    });

    // 2. Filter by subject if not overall
    const subjectMarks = activeSubject === 'Overall' 
      ? filteredMarks 
      : filteredMarks.filter(m => m.subject === activeSubject);

    // 3. Aggregate by student
    const studentTotals: Record<string, number> = {};
    subjectMarks.forEach(m => {
      studentTotals[m.studentId] = (studentTotals[m.studentId] || 0) + m.score;
    });

    // 4. Sort and build leaderboard
    let list = data.students.map(s => ({
      ...s,
      total: studentTotals[s.id] || 0
    }));

    // 5. Filter by group
    if (activeGroup !== 'All Groups') {
      list = list.filter(s => s.group === activeGroup);
    }

    list.sort((a, b) => b.total - a.total);

    // 6. Add rank (handle ties)
    let currentRank = 1;
    return list.map((student, index) => {
      if (index > 0 && list[index - 1].total > student.total) {
        currentRank = index + 1;
      }
      return { ...student, rank: currentRank };
    });
  }, [data, activeSubject, activeGroup, timeFrame]);

  const currentUserData = rankings.find(r => r.id === user.studentId);

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Your Result Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-lg space-y-2">
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Your Position</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-4xl font-black">#{currentUserData?.rank || '-'}</p>
              <p className="text-blue-100 text-xs mt-1">out of {rankings.length} students</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{currentUserData?.total || 0}</p>
              <p className="text-blue-100 text-xs mt-1">Total Marks</p>
            </div>
          </div>
        </div>

        {/* Global Filters */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <p className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter by Subject
            </p>
            <div className="flex flex-wrap gap-2">
              {['Overall', ...data.subjects].map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSubject(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeSubject === s 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            
            <p className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 pt-2">
              <Users className="w-4 h-4" /> Filter by Group
            </p>
            <div className="flex flex-wrap gap-2">
              {['All Groups', ...data.groups].map(g => (
                <button
                  key={g}
                  onClick={() => setActiveGroup(g)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeGroup === g 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px bg-slate-100 hidden md:block" />

          <div className="flex-1 space-y-3">
            <p className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Time Period
            </p>
            <div className="flex gap-2">
              {(['all', 'daily', 'weekly', 'monthly'] as TimeFrame[]).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeFrame(tf)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                    timeFrame === tf
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="text-amber-500" />
            {activeSubject} Leaderboard
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase bg-white px-3 py-1 rounded-full border border-slate-200">
            {timeFrame} Ranking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Rank</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student Info</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Roll Number</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankings.map((student, index) => {
                const isTop3 = student.rank <= 3 && student.total > 0;
                const isMe = student.id === user.studentId;

                return (
                  <tr 
                    key={student.id} 
                    className={`transition-all ${
                      isTop3 ? 'bg-amber-50/30' : ''
                    } ${isMe ? 'bg-blue-50/50 ring-2 ring-blue-100 ring-inset' : 'hover:bg-slate-50'}`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {student.rank === 1 && student.total > 0 ? (
                          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white p-1 shadow-sm">
                            <Trophy className="w-4 h-4" />
                          </div>
                        ) : student.rank === 2 && student.total > 0 ? (
                          <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-white p-1 shadow-sm">
                            <Medal className="w-4 h-4" />
                          </div>
                        ) : student.rank === 3 && student.total > 0 ? (
                          <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white p-1 shadow-sm">
                            <Medal className="w-4 h-4" />
                          </div>
                        ) : (
                          <span className="w-8 h-8 flex items-center justify-center font-bold text-slate-400">
                            {student.rank}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className={`font-bold ${isMe ? 'text-blue-600' : 'text-slate-800'}`}>
                          {student.name} {isMe && '(You)'}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{student.group}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden sm:table-cell">
                      <span className="font-mono text-sm text-slate-500 tracking-tighter">#{student.rollNumber}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`text-lg font-black ${isTop3 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {student.total}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">points</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
