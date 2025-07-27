const { useState, useEffect } = React;
const API_BASE = 'https://claude-code-ai-lab.onrender.com';

function App() {
  const [tasks, setTasks] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loggedIn, setLoggedIn] = React.useState(false);

  async function register() {
    await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    await login();
  }

  async function login() {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      setLoggedIn(true);
      loadTasks();
    }
  }

  async function loadTasks() {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    });
    const data = await res.json();
    setTasks(data);
  }

  async function addTask() {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description: '' })
    });
    const task = await res.json();
    setTasks([...tasks, task]);
    setTitle('');
  }

  useEffect(() => {
    if (loggedIn) {
      loadTasks();
    }
  }, [loggedIn]);

  return (
    <div>
      {!loggedIn ? (
        <div>
          <h2>Login or Register</h2>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
          <button onClick={register}>Register</button>
        </div>
      ) : (
        <div>
          <h2>Task Manager</h2>
          <input placeholder="New task title" value={title} onChange={e => setTitle(e.target.value)} />
          <button onClick={addTask}>Add Task</button>
          <ul>
            {tasks.map(task => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
