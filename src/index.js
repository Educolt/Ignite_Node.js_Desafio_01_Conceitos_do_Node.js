const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {

  // Codígo da solução
  const { id } = request.query;
  const isExist = users.find(user => user.id === id);

  if(!isExist) {
    return response.status(404).json({error: 'User not found !'});
  }

  next();
}

app.post('/users', (request, response) => {

  // Codígo da solução
  const { name, username } = request.body;

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
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;