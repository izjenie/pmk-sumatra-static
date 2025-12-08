# Docker Deployment Guide

## Prerequisites

- Docker installed on your machine
- Access to Docker Hub (for production)

---

## Development

### 1. Build Image

```bash
docker build -t pmk-sumatera-static .
```

### 2. Run Container

```bash
docker run -p 3000:3000 pmk-sumatera-static
```

### 3. Access Application

Open browser: `http://localhost:3000`

### 4. Stop Container

```bash
# List running containers
docker ps

# Stop container
docker stop <container_id>
```

---

## Production

### 1. Build Image

```bash
docker build -t izjenie/pmk-sumatera-static:latest .
```

### 2. Login to Docker Hub

```bash
docker login
```

### 3. Push Image

```bash
docker push izjenie/pmk-sumatera-static:latest
```

### 4. Pull & Run on Production Server

```bash
# Pull image
docker pull izjenie/pmk-sumatera-static:latest

# Run container
docker run -d -p 3000:3000 --name pmk-sumatera-static --restart unless-stopped izjenie/pmk-sumatera-static:latest
```

### 5. Verify Deployment

```bash
# Check container status
docker ps

# View logs
docker logs pmk-sumatera-static
```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `docker ps` | List running containers |
| `docker ps -a` | List all containers |
| `docker images` | List images |
| `docker logs <container>` | View container logs |
| `docker stop <container>` | Stop container |
| `docker rm <container>` | Remove container |
| `docker rmi <image>` | Remove image |

---

## Versioning (Optional)

Tag with version for better tracking:

```bash
# Build with version tag
docker build -t izjenie/pmk-sumatera-static:v1.0.0 .

# Push versioned image
docker push izjenie/pmk-sumatera-static:v1.0.0
```
