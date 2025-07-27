import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

// In-memory data stores
const users = [];
const tasks = {};
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Register new user
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const existing = users.find(u => u.username === username);
  if (existing) {
    return res.status(409).json({ error: 'User already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  tasks[username] = [];
  res.json({ message: 'User registered' });
});

// Login user
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Get tasks for current user
app.get('/tasks', authenticateToken, (req, res) => {
  const username = req.user.username;
  res.json(tasks[username] || []);
});

// Create task
app.post('/tasks', authenticateToken, (req, res) => {
  const username = req.user.username;
  const { title, description } = req.body;
  const id = Date.now().toString();
  const task = { id, title, description, completed: false };
  tasks[username].push(task);
  res.json(task);
});

// Update task
app.put('/tasks/:id', authenticateToken, (req, res) => {
  const username = req.user.username;
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const userTasks = tasks[username];
  const task = userTasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (completed !== undefined) task.completed = completed;
  res.json(task);
});

// Delete task
app.delete('/tasks/:id', authenticateToken, (req, res) => {
  const username = req.user.username;
  const { id } = req.params;
  const userTasks = tasks[username];
  const index = userTasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  userTasks.splice(index, 1);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
