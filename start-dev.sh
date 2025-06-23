#!/bin/bash

# Set environment variables to bypass CORS issues
export EXPO_USE_DEV_SERVER=1
export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
export EXPO_DEVTOOLS_LISTEN_PORT=8081

# Start Expo with web support and allow all hosts
npx expo start --web --host 0.0.0.0 --port 8081 