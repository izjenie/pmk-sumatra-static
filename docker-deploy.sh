#!/bin/bash

echo " Building Docker image..."
docker-compose build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    echo "🚀 Starting containers..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo "✅ Containers running: http://localhost:8080"
    else
        echo "❌ Failed to start containers"
        exit 1
    fi
else
    echo "❌ Build failed"
    exit 1
fi
