# Claude Code AI Lab

This repository demonstrates a fully AI‑built full‑stack task management application.  The backend is a Node.js/Express API with JWT‑based authentication, and the frontend is a React single‑page app served via GitHub Pages.

## Backend

The `backend` folder contains an Express server that supports user registration, login and CRUD operations on tasks.  JWT tokens are used to authenticate requests.

### Running locally

1. Ensure you have Node.js 18 installed.
2. From the project root, run:
   ```bash
   cd backend
   npm install
   node index.js
   ```
3. The API will start on port **3000** (or the `PORT` environment variable if set).

### API Endpoints

- `POST /auth/register` – register a new user (JSON body with `username` and `password`).
- `POST /auth/login` – log in and receive a JWT.
- `GET /tasks` – get a list of tasks (requires Bearer token).
- `POST /tasks` – create a new task (requires Bearer token).
- `PUT /tasks/:id` – update a task by id.
- `DELETE /tasks/:id` – delete a task by id.


## Frontend

The `frontend` folder contains a lightweight React application that allows users to register, log in, add tasks and view their tasks.  The app is written in a single `App.js` file using JSX and is transpiled by Babel in the browser.

### Running locally

You can open the front‑end directly in a browser or serve it statically:

```bash
# From the project root
cd frontend
# open index.html in your browser, or serve with any static server
```

The production version is automatically deployed to GitHub Pages via the deployment workflow.

## Workflows

Two GitHub Actions workflows are included:

- **AI Code Quality** (
`ai-code-quality.yml`) – runs ESLint, Prettier, `npm audit`, and invokes the Claude Code and OpenAI CLI tools on every push to ensure AI‑generated code meets quality standards.
- **Deploy to GitHub Pages** (`deploy.yml`) – builds the frontend into the `public` folder and deploys it to the `gh-pages` branch.

## Live Demo

The React frontend is hosted via GitHub Pages at:

```
https://blakegallagher1.github.io/claude-code-ai-lab/
```

Keep in mind the backend API needs to be running separately to use all features.

## License

This project is provided for educational purposes.  Feel free to adapt it for your own experiments with AI-driven development.
