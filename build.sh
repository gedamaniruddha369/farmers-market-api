#!/bin/bash
# Create any necessary directories
mkdir -p backend/data

# Install Python dependencies
pip install -r requirements.txt

# Make sure the script is executable
chmod +x start.sh 