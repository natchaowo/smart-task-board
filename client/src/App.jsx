import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
 
// ตรวจสอบว่า Port 5000 ตรงกับที่ Backend รันอยู่
// const API_URL = "http://localhost:5000/tasks";
const API_URL = "https://natcha-special-topics.onrender.com/api/tasks";
 
function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
 
  // ดึงข้อมูลทั้งหมดจาก MongoDB เมื่อเปิดหน้าเว็บ
  useEffect(() => {
    fetchTasks();
  }, []);
 
  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("ไม่สามารถดึงข้อมูลได้:", err);
    }
  };
 
  // 1. Input Field: เพิ่มงานใหม่ (ส่งค่า 'text' ให้ตรงกับ Schema)
  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      // ส่ง Object { text: input } ไปที่ Backend
      const res = await axios.post(API_URL, { text: input });
      setTasks([res.data, ...tasks]); // อัปเดตรายการในหน้าจอทันที
      setInput(""); // ล้างช่องกรอก
    } catch (err) {
      console.error("Add failed:", err);
    }
  };
 
  // 2. Toggle Status: คลิกที่ชื่อเพื่อขีดฆ่า (Mark as Done)
  const toggleTask = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`);
      // อัปเดตสถานะใน State เพื่อให้หน้าจอเปลี่ยนตามข้อมูลใน DB
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
 
  // 3. Delete Button: ปุ่มสำหรับลบรายการงาน
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // กรองรายการที่ถูกลบออกไปจากหน้าจอ
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
 
  return (
    <div>
      <h1>To-Do List (MERN Stack)</h1>
 
      {/* ส่วนสำหรับพิมพ์งานใหม่ */}
      <form onSubmit={addTask}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="กรอกชื่องานที่นี่..."
        />
        <button type="submit">Add Task</button>
      </form>
 
      <hr />
 
      {/* ส่วนแสดงรายการงาน (Task List) */}
      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ marginBottom: "10px" }}>
            <span
              onClick={() => toggleTask(task._id)}
              style={{
                cursor: "pointer",
                // ถ้า completed เป็น true ให้ขีดฆ่า (Mark as Done)
                textDecoration: task.done ? "line-through" : "none",
                color: task.done ? "gray" : "black"
              }}
            >
              {task.text}
            </span>
            {"  "}
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
 
      {tasks.length === 0 && <p>ไม่มีรายการงานค้างอยู่</p>}
    </div>
  );
}
 
export default App;
