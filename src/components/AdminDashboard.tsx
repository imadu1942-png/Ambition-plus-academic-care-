import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { AppData, Student, Mark } from '../types';
import { UserPlus, PlusCircle, Users, BookOpen, Edit2, Save, X, Settings, Trash2 } from 'lucide-react';

interface AdminDashboardProps {
  data: AppData;
  socket: Socket | null;
}

export default function AdminDashboard({ data, socket }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'marks' | 'settings'>('marks');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newSubject, setNewSubject] = useState('');
  const [newGroup, setNewGroup] = useState('');
  
  // Form states
  const [newStudent, setNewStudent] = useState({ name: '', rollNumber: '', group: '' });
  const [newMark, setNewMark] = useState({ studentId: '', subject: '', score: '' });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket) {
      socket.emit('add_student', newStudent);
      setNewStudent({ name: '', rollNumber: '', group: '' });
    }
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && editingStudent) {
      socket.emit('update_student', editingStudent);
      setEditingStudent(null);
    }
  };

  const handleAddMark = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket) {
      socket.emit('add_mark', {
        studentId: newMark.studentId,
        subject: newMark.subject,
        score: parseFloat(newMark.score),
      });
      setNewMark({ studentId: '', subject: '', score: '' });
    }
  };
  
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && newSubject) {
      socket.emit('add_subject', newSubject);
      setNewSubject('');
    }
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && newGroup) {
      socket.emit('add_group', newGroup);
      setNewGroup('');
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    if (socket) {
      if (confirm('Are you sure you want to delete this student and all their marks?')) {
        socket.emit('delete_student', studentId);
      }
    }
  };

  const handleDeleteMark = (markId: string) => {
    if (socket) {
      if (confirm('Delete this mark entry?')) {
        socket.emit('delete_mark', markId);
      }
    }
  };

  const handleDeleteSubject = (subject: string) => {
    if (socket) {
      if (confirm(`Delete subject "${subject}"?`)) {
        socket.emit('delete_subject', subject);
      }
    }
  };

  const handleDeleteGroup = (group: string) => {
    if (socket) {
      if (confirm(`Delete group "${group}"?`)) {
        socket.emit('delete_group', group);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex bg-white rounded-xl shadow-sm p-1 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('marks')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all min-w-[120px] ${
            activeTab === 'marks' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="font-medium">Add Marks</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all min-w-[120px] ${
            activeTab === 'students' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Students</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all min-w-[120px] ${
            activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>

      {activeTab === 'marks' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="text-blue-600" />
              Add Exam Marks
            </h3>
            <form onSubmit={handleAddMark} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
                <select
                  required
                  value={newMark.studentId}
                  onChange={(e) => setNewMark({ ...newMark, studentId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a student...</option>
                  {data.students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <select
                    required
                    value={newMark.subject}
                    onChange={(e) => setNewMark({ ...newMark, subject: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select subject...</option>
                    {data.subjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newMark.score}
                    onChange={(e) => setNewMark({ ...newMark, score: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="85.5"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-100"
              >
                Add Marks (Cumulative)
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-4">Recent Entries</h3>
            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2">
              {data.marks.slice().reverse().slice(0, 10).map((mark) => {
                const student = data.students.find(s => s.id === mark.studentId);
                return (
                  <div key={mark.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-800">{student?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{mark.subject} • {new Date(mark.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">+{mark.score}</span>
                      <button 
                        onClick={() => handleDeleteMark(mark.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {data.marks.length === 0 && <p className="text-slate-400 text-center py-8">No marks added yet</p>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserPlus className="text-blue-600" />
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h3>
            <form onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent} className="grid sm:grid-cols-3 gap-4">
              <input
                type="text"
                required
                value={editingStudent ? editingStudent.name : newStudent.name}
                onChange={(e) => editingStudent 
                  ? setEditingStudent({...editingStudent, name: e.target.value})
                  : setNewStudent({ ...newStudent, name: e.target.value })
                }
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Student Name"
              />
              <input
                type="text"
                required
                value={editingStudent ? editingStudent.rollNumber : newStudent.rollNumber}
                onChange={(e) => editingStudent
                  ? setEditingStudent({...editingStudent, rollNumber: e.target.value})
                  : setNewStudent({ ...newStudent, rollNumber: e.target.value })
                }
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Roll Number"
              />
              <div className="flex gap-2">
                <select
                  required
                  value={editingStudent ? editingStudent.group : newStudent.group}
                  onChange={(e) => editingStudent
                    ? setEditingStudent({...editingStudent, group: e.target.value})
                    : setNewStudent({ ...newStudent, group: e.target.value })
                  }
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Group...</option>
                  {data.groups.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-100 whitespace-nowrap"
                >
                  {editingStudent ? <Save className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                </button>
                {editingStudent && (
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="bg-slate-200 text-slate-600 px-3 py-2 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-bottom border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Group</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Total Marks</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.students.map((student) => {
                    const totalMarks = data.marks
                      .filter(m => m.studentId === student.id)
                      .reduce((sum, m) => sum + m.score, 0);
                    
                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{student.name}</td>
                        <td className="px-6 py-4 text-slate-600">{student.rollNumber}</td>
                        <td className="px-6 py-4 text-slate-600">
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold">{student.group}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-blue-600">{totalMarks}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => setEditingStudent(student)}
                              className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      )}

      {activeTab === 'settings' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-4">Subjects</h3>
            <form onSubmit={handleAddSubject} className="flex gap-2 mb-4">
              <input
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New Subject"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg"><PlusCircle /></button>
            </form>
            <div className="flex flex-wrap gap-2">
              {data.subjects.map(s => (
                <span key={s} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  {s}
                  <button onClick={() => handleDeleteSubject(s)} className="text-slate-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-4">Groups</h3>
            <form onSubmit={handleAddGroup} className="flex gap-2 mb-4">
              <input
                type="text"
                required
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New Group"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg"><PlusCircle /></button>
            </form>
            <div className="flex flex-wrap gap-2">
              {data.groups.map(g => (
                <span key={g} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  {g}
                  <button onClick={() => handleDeleteGroup(g)} className="text-slate-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
