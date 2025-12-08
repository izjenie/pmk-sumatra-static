#!/bin/bash

IMAGE_NAME="pmk-sumatera-static"
TAG="${1:-latest}"

echo "🔨 Building Docker image: $IMAGE_NAME:$TAG"
docker build -t $IMAGE_NAME:$TAG .

if [ $? -eq 0 ]; then
    echo "✅ Build successful: $IMAGE_NAME:$TAG"
else
    echo "❌ Build failed"
    exit 1
fi
