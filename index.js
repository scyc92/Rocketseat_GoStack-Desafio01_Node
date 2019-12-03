const express = require('express');

const server = express();

server.use(express.json());

// A variável 'projects' pode ser 'const' porque um 'array'
// pode receber adições ou exclusões mesmo sendo uma constante.
const projects = [];

//Middlewares

//Verificar se projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

//Contagem do Log numero de requisicoes

function logRequests(req, res, next) {

  console.count("Número de requisições");

  return next();
}

// Retorna todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Cadastra um projeto atraves de ID e Title
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(projects);
});

//Cadastrar tarefa de acordo com o ID

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});


// Lista de todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Atualizar Titulo do projeto de acordo com o ID do parametro
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

// Deletar projeto de acordo com o ID parametro rota
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(id, 1);
  return res.send();
});

server.listen(3000);