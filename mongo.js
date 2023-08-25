const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('requires password as argument');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://pouyan:${password}@cluster0.rlbecqk.mongodb.net/phonebook`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (name) {
  const person = new Person({
    name,
    number,
  });

  person.save().then((res) => {
    console.log(`added ${res.name} number ${res.number} to phonebook`);
    mongoose.connection.close()
  });
} else {
  Person.find({}).then((res) => {
    console.log('phonebook:');
    res.forEach(p => console.log(`${p.name} ${p.number}`));
    mongoose.connection.close();
  });
}


