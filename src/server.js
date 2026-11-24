const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Models
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
  })
);

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    completed: {
      type: Boolean,
      default: false
    }
  })
);

// Home Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Task Management API is Running"
  });
});

// USERS ENDPOINTS

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

app.post("/api/users", async (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      message: "Name and email are required"
    });
  }

  const user = await User.create(req.body);
  res.status(201).json(user);
});

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

app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json(tasks);
});

app.post("/api/tasks", async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({
      message: "Task title is required"
    });
  }

  const task = await Task.create(req.body);
  res.status(201).json(task);
});

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

// Export app and models for testing
module.exports = { app, User, Task };

// Start Server only when executed directly
async function startServer() {
  await mongoose.connect(
    process.env.MONGO_URL || "mongodb://localhost:27017/taskdb"
  );

  console.log("Database Connected");

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch(err => {
    console.error("Server Startup Error:", err);
    process.exit(1);
  });
}
