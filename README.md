# Task Management API

A REST API for managing users and tasks.

## Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose
- Docker
- Docker Compose

## Features
- Create and retrieve users
- Delete users
- Create and retrieve tasks
- Update and delete tasks
- Input validation
- HTTP Status Code handling
- Docker containerization

## API Endpoints

### Users

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| GET | /api/users | Get all users | 200 |
| POST | /api/users | Create user | 201 |
| GET | /api/users/:id | Get user | 200, 400, 404 |
| DELETE | /api/users/:id | Delete user | 200, 400, 404 |

### Tasks

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| GET | /api/tasks | Get all tasks | 200 |
| POST | /api/tasks | Create task | 201 |
| GET | /api/tasks/:id | Get task | 200, 400, 404 |
| PUT | /api/tasks/:id | Update task | 200, 400, 404 |
| DELETE | /api/tasks/:id | Delete task | 200, 400, 404 |

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK - Successful request |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Docker Commands

Build and run:

```bash
docker compose up --build -d
```

Check containers:

```bash
docker ps
```

View logs:

```bash
docker compose logs
```

Stop containers:

```bash
docker compose down
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start server:

```bash
npm start
```

Server runs on port 3000.
