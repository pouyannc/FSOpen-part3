require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  })
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

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const newPerson = req.body;

  if (!newPerson.name || !newPerson.number) res.status(400).json({status: "name and/or number missing"});
  // else if (persons.find((p) => p.name.toLowerCase() === newPerson.name.toLowerCase())) {
  //   res.status(400).json({status: "name already exists"});
  // } 
  else {
    const newEntry = new Person(newPerson);
    newEntry.save().then((savedEntry) => {
      res.json(savedEntry);
    })
  }
})

const routeNotFound = (req, res) => {
  console.log('invalid route');

  res.status(404).json({status: 'Route not found'});
}

app.use(routeNotFound);

const errorHandler = (error, req, res, next) => {
  console.log(`reached error handler with error ${error.name}`);
  console.log(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {console.log(`listening on port ${PORT}`);})
