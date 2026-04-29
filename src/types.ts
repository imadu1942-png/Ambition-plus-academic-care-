export type Role = 'admin' | 'student';

export interface User {
  id: string;
  username: string;
  role: Role;
  studentId?: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  group: string;
}

export interface Mark {
  id: string;
  studentId: string;
  subject: string;
  score: number;
  timestamp: string;
}

export interface AppData {
  students: Student[];
  marks: Mark[];
  subjects: string[];
  groups: string[];
}
