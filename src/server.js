const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Database Connection
mongoose.connect(
  process.env.MONGO_URL || "mongodb://localhost:27017/taskdb"
)
.then(() => console.log("Database Connected"))
.catch(err => console.log("Database Error:", err));

// User Model
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String
}));

// Task Model
const Task = mongoose.model("Task", new mongoose.Schema({
  title: String,
  description: String,
  completed: {
    type: Boolean,
    default: false
  }
}));

// Home Endpoint
app.get("/", (req, res) => {
  res.send("Task Management API is Running");
});

// USERS ENDPOINTS

app.get("/api/users", async (req, res) => {
  res.json(await User.find());
});

app.post("/api/users", async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

app.delete("/api/users/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted" });
});

// TASKS ENDPOINTS

app.get("/api/tasks", async (req, res) => {
  res.json(await Task.find());
});

app.post("/api/tasks", async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

app.get("/api/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

app.put("/api/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted" });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
