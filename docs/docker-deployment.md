# Docker Deployment Guide

## Prerequisites

- Docker installed on your machine

---

## Quick Deploy

Build dan jalankan dengan satu command:

```bash
./docker-deploy.sh
```

Akses aplikasi di: `http://localhost:3000`

---

## Manual Deployment

### 1. Build Image

```bash
./docker-build.sh
```

### 2. Run Container

```bash
docker run -d -p 3000:3000 --name pmk-sumatera-static --restart unless-stopped pmk-sumatera-static
```

### 3. Access Application

Open browser: `http://localhost:3000`

---

## Stop & Remove Container

```bash
docker stop pmk-sumatera-static
docker rm pmk-sumatera-static
```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `docker ps` | List running containers |
| `docker ps -a` | List all containers |
| `docker images` | List images |
| `docker logs pmk-sumatera-static` | View container logs |
| `docker stop pmk-sumatera-static` | Stop container |
| `docker rm pmk-sumatera-static` | Remove container |
| `docker rmi pmk-sumatera-static` | Remove image |
