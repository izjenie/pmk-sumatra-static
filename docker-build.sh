#!/bin/bash

IMAGE_NAME="izjenie/pmk-sumatera-static"
TAG="${1:-latest}"

echo "🔨 Building Docker image: $IMAGE_NAME:$TAG for linux/amd64"
docker build --platform linux/amd64 -t $IMAGE_NAME:$TAG .

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo "� Logging in to Docker Hub..."
    docker login
    echo "�🚀 Pushing to Docker Hub..."
    docker push $IMAGE_NAME:$TAG
    
    if [ $? -eq 0 ]; then
        echo "✅ Push successful: $IMAGE_NAME:$TAG"
    else
        echo "❌ Push failed. Make sure you're logged in: docker login"
        exit 1
    fi
else
    echo "❌ Build failed"
    exit 1
fi
