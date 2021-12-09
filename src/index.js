const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {

  // Codígo da solução
  const { username } = request.headers;
  const isExist = users.find(user => user.username === username);

  if(!isExist) {
    return response.status(404).json({error: 'User not found !'});
  }

  request.user = isExist;

  next();
}

app.post('/users', (request, response) => {

  // Codígo da solução
  const { name, username } = request.body;

  const usernameExist = users.find(user => user.username === username);

  if(usernameExist) {
    return response.status(400).json({error: 'Username already exists !'});
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  // Codígo da solução
  const { username } = request.headers;

  const userIndex = users.findIndex(u => u.username === username);
  
  const todos = users[userIndex].todos;

  return response.status(200).json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  // Codígo da solução
  const { title, deadline } = request.body;
  const { username } = request.headers;

  const todo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  }

  const index = users.findIndex( user => user.username === username);

  users[index].todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {

  // Codígo da solução
  const { id } = request.params;
  const { username } = request.headers;

  const { title, deadline } = request.body

  // get user index
  const index = users.findIndex( user => user.username === username);

  // get todo index
  const todoIndex = users[index].todos.findIndex( todo => todo.id === id);

  if(todoIndex === -1) {
    return response.status(404).json({ error:"Todo not found !"})
  }

  // get oldTodo
  const todo = users[index].todos[todoIndex];

  // create updated todo
  const newTodo = {
    ...todo,
    title,
    deadline: new Date(deadline),
  }

  // set todo
  users[index].todos[todoIndex] = newTodo;

  return response.status(201).json(newTodo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  
  // Codígo da solução
  const { id } = request.params;
  const { username } = request.headers;

  const index = users.findIndex(user => user.username === username);

  const todoIndex = users[index].todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1) {
    return response.status(404).json({error: 'Todo not found !'});
  }

  users[index].todos[todoIndex].done = true;

  const todo = users[index].todos[todoIndex];

  return response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  
  // Codígo da solução
  const { username } = request.headers;
  const { id } = request.params;

  const index = users.findIndex(user => user.username === username);

  const todoIndex = users[index].todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1) {
    return response.status(404).json({ error:"Todo not found !"})
  }

  users[index].todos.splice(todoIndex, 1);

  return response.status(204).json();
});

module.exports = app;