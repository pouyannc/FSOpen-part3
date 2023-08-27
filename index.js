require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const newPerson = req.body;
  const newEntry = new Person(newPerson);
  newEntry.save().then((savedEntry) => {
    res.json(savedEntry);
  })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const person = req.body;

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then((updatedEntry) => {
      res.json(updatedEntry);
    })
    .catch((error) => next(error));
});

const routeNotFound = (req, res) => {
  console.log('invalid route');

  res.status(404).json({ status: 'Route not found' });
};

app.use(routeNotFound);

const errorHandler = (error, req, res, next) => {
  console.log(`reached error handler with error ${error.name}`);
  console.log(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).send(error.message);
  }

  return next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { console.log(`listening on port ${PORT}`); });
