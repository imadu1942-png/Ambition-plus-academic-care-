import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(process.cwd(), "db.json");

// Helper to load/save data
const loadData = () => {
  if (fs.existsSync(DB_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    } catch (e) {
      console.error("Error loading DB, resetting...");
    }
  }
  return {
    students: [],
    marks: [],
    subjects: ["Math", "English", "General Science"],
    groups: ["Science", "Commerce", "Arts"],
    users: [
      { id: "u1", username: "Admin", password: "29306", role: "admin" },
    ]
  };
};

const saveData = (data: any) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  app.use(express.json());

  let data = loadData();

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    
    // Case-insensitive check for Admin, others are exact (Roll Number)
    const user = data.users.find((u: any) => {
      const unameMatch = u.role === 'admin' 
        ? u.username.toLowerCase() === username.toString().toLowerCase() 
        : u.username === username.toString();
      return unameMatch && u.password === password.toString();
    });

    if (user) {
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role, 
          studentId: user.studentId 
        } 
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid Credentials. Use Admin/29306 or RollNo/12345" });
    }
  });

  // Socket.io for real-time
  io.on("connection", (socket) => {
    socket.emit("initial_data", data);

    socket.on("add_student", (student) => {
      const newStudent = { ...student, id: Math.random().toString(36).substr(2, 9) };
      data.students.push(newStudent);
      data.users.push({
        id: "u" + Math.random().toString(36).substr(2, 9),
        username: newStudent.rollNumber,
        password: "12345",
        role: "student",
        studentId: newStudent.id
      });
      saveData(data);
      io.emit("data_updated", data);
    });

    socket.on("update_student", (updatedStudent) => {
      const index = data.students.findIndex((s: any) => s.id === updatedStudent.id);
      if (index !== -1) {
        data.students[index] = updatedStudent;
        saveData(data);
        io.emit("data_updated", data);
      }
    });

    socket.on("delete_student", (studentId) => {
      data.students = data.students.filter((s: any) => s.id !== studentId);
      data.marks = data.marks.filter((m: any) => m.studentId !== studentId);
      data.users = data.users.filter((u: any) => u.studentId !== studentId);
      saveData(data);
      io.emit("data_updated", data);
    });

    socket.on("add_mark", (mark) => {
      const newMark = { 
        ...mark, 
        id: "m" + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
      };
      data.marks.push(newMark);
      saveData(data);
      io.emit("data_updated", data);
    });

    socket.on("delete_mark", (markId) => {
      data.marks = data.marks.filter((m: any) => m.id !== markId);
      saveData(data);
      io.emit("data_updated", data);
    });

    socket.on("add_subject", (subject) => {
      if (!data.subjects.includes(subject)) {
        data.subjects.push(subject);
        saveData(data);
        io.emit("data_updated", data);
      }
    });

    socket.on("delete_subject", (subject) => {
      data.subjects = data.subjects.filter((s: any) => s !== subject);
      saveData(data);
      io.emit("data_updated", data);
    });

    socket.on("add_group", (group) => {
      if (!data.groups.includes(group)) {
        data.groups.push(group);
        saveData(data);
        io.emit("data_updated", data);
      }
    });

    socket.on("delete_group", (group) => {
      data.groups = data.groups.filter((g: any) => g !== group);
      saveData(data);
      io.emit("data_updated", data);
    });
  });

  // Vite setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(3000, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:3000`);
  });
}

startServer();

