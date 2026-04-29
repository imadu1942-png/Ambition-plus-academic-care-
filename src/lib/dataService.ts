import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  setDoc,
  getDoc,
  writeBatch,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';
import { AppData, Student, Mark } from '../types';

export const subscribeToData = (onData: (data: AppData) => void) => {
  const data: AppData = {
    students: [],
    marks: [],
    subjects: [],
    groups: []
  };

  const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
    data.students = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Student));
    onData({ ...data });
  });

  const unsubMarks = onSnapshot(collection(db, 'marks'), (snapshot) => {
    data.marks = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Mark));
    onData({ ...data });
  });

  const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
    if (snapshot.exists()) {
      const settings = snapshot.data();
      data.subjects = settings.subjects || [];
      data.groups = settings.groups || [];
    } else {
      // Initialize if doesn't exist
      setDoc(doc(db, 'settings', 'global'), {
        subjects: ["Math", "English", "General Science"],
        groups: ["Science", "Commerce", "Arts"]
      });
    }
    onData({ ...data });
  });

  return () => {
    unsubStudents();
    unsubMarks();
    unsubSettings();
  };
};

export const addStudent = async (student: Omit<Student, 'id'>) => {
  await addDoc(collection(db, 'students'), student);
};

export const updateStudent = async (student: Student) => {
  const { id, ...rest } = student;
  await updateDoc(doc(db, 'students', id), rest);
};

export const deleteStudent = async (studentId: string) => {
  // Use batch for deletion
  const batch = writeBatch(db);
  batch.delete(doc(db, 'students', studentId));
  
  // Also delete associated marks
  const marksQuery = query(collection(db, 'marks'), where('studentId', '==', studentId));
  const marksSnapshot = await getDocs(marksQuery);
  marksSnapshot.forEach(d => batch.delete(d.ref));
  
  await batch.commit();
};

export const addMark = async (mark: Omit<Mark, 'id' | 'timestamp'>) => {
  await addDoc(collection(db, 'marks'), {
    ...mark,
    timestamp: new Date().toISOString()
  });
};

export const deleteMark = async (markId: string) => {
  await deleteDoc(doc(db, 'marks', markId));
};

export const addSubject = async (subject: string) => {
  const ref = doc(db, 'settings', 'global');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const subjects = snap.data().subjects || [];
    if (!subjects.includes(subject)) {
      await updateDoc(ref, { subjects: [...subjects, subject] });
    }
  }
};

export const deleteSubject = async (subject: string) => {
  const ref = doc(db, 'settings', 'global');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const subjects = snap.data().subjects || [];
    await updateDoc(ref, { subjects: subjects.filter((s: string) => s !== subject) });
  }
};

export const addGroup = async (group: string) => {
  const ref = doc(db, 'settings', 'global');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const groups = snap.data().groups || [];
    if (!groups.includes(group)) {
      await updateDoc(ref, { groups: [...groups, group] });
    }
  }
};

export const deleteGroup = async (group: string) => {
  const ref = doc(db, 'settings', 'global');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const groups = snap.data().groups || [];
    await updateDoc(ref, { groups: groups.filter((g: string) => g !== group) });
  }
};
