const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'name must be at least 3 characters long'],
  },
  number: {
    type: String,
    minLength: [8, 'number must consist of at least 8 characters'],
    validate: {
      validator: (v) => {
        console.log(v);
        return /^[0-9]{2,3}-[0-9]+/.test(v);
      },
      message: 'Invalid phone number. Must be written with a hyphen separating 2 or 3 digit area code: (code)-(number).',
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
