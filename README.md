# Garage Assistant

Turns a customer's free-text vehicle fault description into a structured, reviewable service note for a garage service adviser.

Files of note:
- plan.md - contains the initial plan with alterations made along the process
- DEVELOPMENT.md - a short log of the steps taken in the project, with reasoning on decisions.
- excercise.md - The original coding exercise 

# How to run the project

## Prerequisites

- Node.js 20+ and npm
- A [Gemini API key](https://aistudio.google.com/apikey)

## Setup

Install dependencies for both workspaces from the project root:

```bash
npm install
```

Copy the backend env file and add your API key:

```bash
cp backend/.env.example backend/.env
```

Then edit `backend/.env` and set `GEMINI_API_KEY`. `PORT` defaults to `4000`.

## Running locally

Start the backend and frontend in separate terminals:

```bash
npm run dev:backend   # http://localhost:4000
npm run dev:frontend  # http://localhost:5173
```

The frontend expects the backend to be running on port 4000.

## Testing

```bash
npm test
```

## Building

```bash
npm run build
```

## Project structure

- `backend/` — Express + TypeScript API, calls the Gemini API to parse fault reports
- `frontend/` — Vite + React + TypeScript UI with Tailwind CSS
- `mock_data/` — sample fault descriptions used to demo the app
