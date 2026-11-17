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

// Models
const User = mongoose.model("User", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
}));

const Task = mongoose.model("Task", new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: {
    type: Boolean,
    default: false
  }
}));

// Home Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Task Management API is Running"
  });
});

// USERS ENDPOINTS

// Get All Users
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Create User
app.post("/api/users", async (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      message: "Name and email are required"
    });
  }

  const user = await User.create(req.body);
  res.status(201).json(user);
});

// Get User By ID
app.get("/api/users/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

// Delete User
app.delete("/api/users/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User deleted" });
});

// TASKS ENDPOINTS

// Get All Tasks
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json(tasks);
});

// Create Task
app.post("/api/tasks", async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({
      message: "Task title is required"
    });
  }

  const task = await Task.create(req.body);
  res.status(201).json(task);
});

// Get Task By ID
app.get("/api/tasks/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
});

// Update Task
app.put("/api/tasks/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
});

// Delete Task
app.delete("/api/tasks/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json({ message: "Task deleted" });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      message: "Invalid JSON format"
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      error: err.message
    });
  }

  res.status(500).json({
    message: "Internal Server Error"
  });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
