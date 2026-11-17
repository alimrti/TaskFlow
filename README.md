# Task Management API

A REST API for managing users and tasks.

## Technologies
- Node.js
- Express.js
- MongoDB
- Docker
- Docker Compose

## Features
- Create users
- Retrieve users
- Delete users
- Create tasks
- Retrieve tasks
- Update tasks
- Delete tasks
- RESTful API architecture
- Docker containerization

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | API status |
| GET | /api/users | Get all users |
| POST | /api/users | Create user |
| GET | /api/users/:id | Get user |
| DELETE | /api/users/:id | Delete user |
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| GET | /api/tasks/:id | Get task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

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
