#!/bin/bash

CONTAINER_NAME="pmk-sumatera-static"
IMAGE_NAME="pmk-sumatera-static"
PORT="${1:-3000}"

echo "🛑 Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null
docker rm $CONTAINER_NAME 2>/dev/null

echo "🔨 Building Docker image: $IMAGE_NAME"
docker build -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo "🚀 Starting container on port $PORT..."
    docker run -d -p $PORT:3000 --name $CONTAINER_NAME --restart unless-stopped $IMAGE_NAME
    
    if [ $? -eq 0 ]; then
        echo "✅ Container running: http://localhost:$PORT"
    else
        echo "❌ Failed to start container"
        exit 1
    fi
else
    echo "❌ Build failed"
    exit 1
fi
