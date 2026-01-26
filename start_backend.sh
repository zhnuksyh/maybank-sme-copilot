#!/bin/bash

# Navigate to the server directory
cd server

# specific python environment check
if [ -d "venv" ]; then
    echo "Activating venv..."
    source venv/bin/activate
elif [ -d ".venv" ]; then
    echo "Activating .venv..."
    source .venv/bin/activate
fi

# Run the FastAPI server
# main.py is in the server root, so we use main:app
echo "Starting FastAPI server..."
uvicorn main:app --reload
