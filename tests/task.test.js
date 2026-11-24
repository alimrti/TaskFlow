const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const { app, Task, User } = require("../src/server");

let server;
let baseURL;

before(async () => {
  await mongoose.connect(
    process.env.MONGO_URL || "mongodb://127.0.0.1:27017/taskdb_test"
  );

  server = app.listen(0);

  await new Promise(resolve => server.once("listening", resolve));

  baseURL = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(async () => {
  await Task.deleteMany({});
  await User.deleteMany({});
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close(err => err ? reject(err) : resolve());
    });
  }

  await mongoose.disconnect();
});

// Test 1: Home endpoint
test("TC-01: Home endpoint should return 200", async () => {
  const response = await fetch(baseURL);

  assert.equal(response.status, 200);
});

// Test 2: Create task
test("TC-02: Create task successfully", async () => {
  const response = await fetch(`${baseURL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Complete CI/CD project",
      description: "Testing TaskFlow"
    })
  });

  const data = await response.json();

  assert.equal(response.status, 201);
  assert.equal(data.title, "Complete CI/CD project");
  assert.equal(data.completed, false);
});

// Test 3: Get all tasks
test("TC-03: Get all tasks", async () => {
  await Task.create({ title: "Test task" });

  const response = await fetch(`${baseURL}/api/tasks`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.length, 1);
});

// Test 4: Get task by ID
test("TC-04: Get task by ID", async () => {
  const task = await Task.create({ title: "Find this task" });

  const response = await fetch(
    `${baseURL}/api/tasks/${task._id}`
  );

  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.title, "Find this task");
});

// Test 5: Update task
test("TC-05: Update task successfully", async () => {
  const task = await Task.create({ title: "Old title" });

  const response = await fetch(
    `${baseURL}/api/tasks/${task._id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New title" })
    }
  );

  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.title, "New title");
});

// Test 6: Delete task
test("TC-06: Delete task successfully", async () => {
  const task = await Task.create({ title: "Delete me" });

  const response = await fetch(
    `${baseURL}/api/tasks/${task._id}`,
    { method: "DELETE" }
  );

  assert.equal(response.status, 200);
  assert.equal(await Task.countDocuments(), 0);
});

// Test 7: Invalid task input
test("TC-07: Reject task without title", async () => {
  const response = await fetch(`${baseURL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: "Missing title" })
  });

  assert.equal(response.status, 400);
});

// Test 8: Invalid task ID
test("TC-08: Reject invalid task ID", async () => {
  const response = await fetch(
    `${baseURL}/api/tasks/invalid-id`
  );

  assert.equal(response.status, 400);
});

// Test 9: Task not found
test("TC-09: Return 404 for missing task", async () => {
  const id = new mongoose.Types.ObjectId();

  const response = await fetch(
    `${baseURL}/api/tasks/${id}`
  );

  assert.equal(response.status, 404);
});
