const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
})

app.get('/info', (req, res) => {
  const date = new Date();
  const bookLength = persons.length;

  res.send(`<p>Phonebook has info for ${bookLength} people</p><p>${date}</p>`);
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  console.log(person)
  person ? res.json(person) : res.status(404).json({status: '404 resource does not exist'});
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
})

app.post('/api/persons', (req, res) => {
  let newPerson = req.body;

  if (!newPerson.name || !newPerson.number) res.status(400).json({status: "name and/or number missing"});
  else if (persons.find((p) => p.name.toLowerCase() === newPerson.name.toLowerCase())) {
    res.status(400).json({status: "name already exists"});
  } else {
    const id = Math.floor(Math.random * 10000);
    newPerson = {
      id,
      name: newPerson.name,
      number: newPerson.number,
    }
    persons.concat(newPerson);
    res.json(newPerson);
  }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {console.log(`listening on port ${PORT}`);})
