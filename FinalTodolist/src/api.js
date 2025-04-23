// src/api.js
const API_URL = 'https://fastapitbackend.onrender.com'; // Update with your backend URL

export const getTodos = async (completed) => {
  let url = `${API_URL}/todos`;
  if (completed !== undefined) url += `?completed=${completed}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
};

export const createTodo = async (title) => {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Failed to create todo');
  return response.json();
};

export const updateTodo = async (id, updates) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
};

export const deleteTodo = async (id) => {
  const response = await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete todo');
};