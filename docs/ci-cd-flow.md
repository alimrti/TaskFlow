# TaskFlow CI/CD Pipeline

## Pipeline Stages

1. Developer pushes code to GitHub.
2. GitHub Actions starts the CI pipeline.
3. Dependencies are installed using npm.
4. Docker environment is prepared.
5. Automated tests are executed.
6. If tests pass, the pipeline continues.
7. If tests fail, the pipeline stops.

## Pipeline Flow

```text
       Code Push
           |
           v
    GitHub Actions
           |
           v
   Install Dependencies
           |
           v
      Docker Build
           |
           v
    Automated Tests
           |
       +---+---+
       |       |
      PASS    FAIL
       |       |
       v       v
    Continue  Stop
    Pipeline  Pipeline
```

## Docker Integration

Docker provides a consistent environment
for running the TaskFlow application and
its MongoDB database.

GitHub Actions can build Docker images
and run the application in containers
before executing integration tests.
