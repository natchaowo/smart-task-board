// --- Import Libraries ---
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Task = require("./models/Task");

const app = express();


// --- CORS Configuration ---
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));


// --- Middlewares ---
app.use(express.json());


// --- Connect MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));


// --- Test Route ---
app.get("/", (req, res) => {
  res.send("API is running...");
});


// --- API Routes ---

// GET all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลได้" });
  }
});


// POST create task
app.post("/tasks", async (req, res) => {
  try {

    const { title, category, priority } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        error: "ต้องมี title และ category"
      });
    }

    const newTask = new Task({
      title,
      category,
      priority: priority || "Medium",
      status: "Pending"
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});


// PUT toggle status
app.put("/tasks/:id", async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        error: "ไม่พบรายการ"
      });
    }

    task.status =
      task.status === "Pending"
        ? "Completed"
        : "Pending";

    await task.save();

    res.json(task);

  } catch (err) {
    res.status(400).json({
      error: "อัปเดตสถานะไม่สำเร็จ"
    });
  }
});


// DELETE task
app.delete("/tasks/:id", async (req, res) => {
  try {

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "ลบสำเร็จ"
    });

  } catch (err) {
    res.status(400).json({
      error: "ลบไม่สำเร็จ"
    });
  }
});


// --- Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});