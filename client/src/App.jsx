import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// URL ของ backend
const API_URL = "https://miniproject-kivg.onrender.com";

function App() {

  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // โหลด task ตอนเปิดเว็บ
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("โหลดข้อมูลไม่ได้:", err);
    }
  };

  // เพิ่ม task
  const addTask = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    try {
      const res = await axios.post(API_URL, {
        title: input,
        category: "Personal",
        priority: "Medium"
      });

      setTasks([res.data, ...tasks]);
      setInput("");

    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  // toggle status
  const toggleTask = async (id) => {
    try {

      const res = await axios.put(`${API_URL}/${id}`);

      setTasks(
        tasks.map((t) =>
          t._id === id ? res.data : t
        )
      );

    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // delete task
  const deleteTask = async (id) => {
    try {

      await axios.delete(`${API_URL}/${id}`);

      setTasks(
        tasks.filter((t) => t._id !== id)
      );

    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="container">

      <h1>Smart Task Board</h1>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="พิมพ์งาน..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button type="submit">
          Add Task
        </button>
      </form>

      <hr />

      <ul>
        {tasks.map((task) => (

          <li key={task._id}>

            <span
              onClick={() => toggleTask(task._id)}
              style={{
                cursor: "pointer",
                textDecoration:
                  task.status === "Completed"
                    ? "line-through"
                    : "none"
              }}
            >
              {task.title}
            </span>

            <button
              onClick={() => deleteTask(task._id)}
            >
              Delete
            </button>

          </li>

        ))}
      </ul>

      {tasks.length === 0 && (
        <p>ไม่มีงาน</p>
      )}

    </div>
  );
}

export default App;
