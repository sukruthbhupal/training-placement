# Smile Detection System

This README applies to the `smile-detection-system` project folder.
If you are in the parent repository root, first `cd smile-detection-system`.

A modern AI-powered smile detection web application built with FastAPI, React, TypeScript, TailwindCSS, and SQLite/PostgreSQL.

## Features
- User authentication with JWT
- Image upload smile detection
- Live webcam-based detection
- Detection history and dashboard analytics
- Dark/light theme support
- Docker support

## Prerequisites
- Python 3.13
- Node.js 20+ and npm
- Git (optional)
- SQLite is built in; PostgreSQL is optional if you use Docker

## Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create or copy environment values if needed:
   ```bash
   cp .env.example .env
   ```
5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
6. Verify the backend is running by opening:
   ```bash
   http://127.0.0.1:8000/health
   ```

## Frontend Setup
1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev -- --host 127.0.0.1 --port 5173
   ```
4. Open the app in your browser at:
   ```bash
   http://127.0.0.1:5173
   ```

> Important: Do not open `frontend/index.html` directly using a file browser or Live Server. The frontend must be served by Vite or a production static server.

## Production Build
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Serve the `dist` folder with a static server, for example:
   ```bash
   npx serve dist
   ```

## Notes
- Backend must be running on `http://127.0.0.1:8000` before using the frontend.
- If you use a different backend host or port, update the frontend API base URL accordingly.
- The app is not designed to work by opening `index.html` directly in the browser without a local server.
