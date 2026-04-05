#!/bin/bash
set -e

# 1. Install Node.js and Git
sudo apt-get update
sudo apt-get install -y git nodejs npm

# 2. Clone the backend repo (replace with your actual repo URL)
REPO_URL="https://github.com/riyawadhwa123/Mental-Health-Journal-and-AI-chatbot.git"
if [ ! -d "Mental-Health-Journal-and-AI-chatbot" ]; then
  git clone "$REPO_URL"
fi
cd Mental-Health-Journal-and-AI-chatbot/backend

# 3. Install dependencies
npm install

# 4. Start the backend server
# Make sure to set up your .env file with proper environment variables
echo "Installing dependencies..."
echo "To start the server, run: npm start"
echo "Or for development mode: npm run dev" 