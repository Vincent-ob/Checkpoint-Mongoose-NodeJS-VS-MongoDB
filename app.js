// app.js

// Load environment variables from .env file
require('dotenv').config(); 
const mongoose = require('mongoose');

// Connect to MongoDB Atlas
const uri = process.env.MONGO_URI; // Get the URI from the .env file
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the Person schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name is a required field
  age: { type: Number },
  favoriteFoods: { type: [String], default: [] } // Array of strings
});

// Create a Person model
const Person = mongoose.model('Person', personSchema);

// Create and Save a Record of a Model
const createPerson = async (name, age, favoriteFoods) => {
  const person = new Person({ name, age, favoriteFoods });
  person.save(function(err, data) {
    if (err) return console.error(err);
    console.log('Person saved:', data);
  });
};

// Create Many Records with model.create()
const createMultiplePeople = async (arrayOfPeople) => {
  await Person.create(arrayOfPeople, (err, data) => {
    if (err) return console.error(err);
    console.log('People created:', data);
  });
};

// Find people by name
const findByName = async (name) => {
  await Person.find({ name }, (err, people) => {
    if (err) return console.error(err);
    console.log('People found with name', name, ':', people);
  });
};

// Find one person by favorite food
const findByFavoriteFood = async (food) => {
  await Person.findOne({ favoriteFoods: food }, (err, person) => {
    if (err) return console.error(err);
    console.log('Person found with favorite food', food, ':', person);
  });
};

// Find person by ID
const findById = async (personId) => {
  await Person.findById(personId, (err, person) => {
    if (err) return console.error(err);
    console.log('Person found by ID', personId, ':', person);
  });
};

// Update person's favorite foods
const updateFavoriteFoods = async (personId) => {
  await Person.findById(personId, async (err, person) => {
    if (err) return console.error(err);
    person.favoriteFoods.push('hamburger'); // Add "hamburger" to the array
    await person.save((err, updatedPerson) => {
      if (err) return console.error(err);
      console.log('Updated person:', updatedPerson);
    });
  });
};

// Update person’s age using findOneAndUpdate
const updateAgeByName = async (personName) => {
  await Person.findOneAndUpdate({ name: personName }, { age: 20 }, { new: true }, (err, updatedPerson) => {
    if (err) return console.error(err);
    console.log('Updated person age:', updatedPerson);
  });
};

// Delete person by ID
const deleteById = async (personId) => {
  await Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return console.error(err);
    console.log('Removed person:', removedPerson);
  });
};

// Delete all people named "Mary"
const deleteManyByName = async (name) => {
  await Person.deleteMany({ name }, (err, result) => {
    if (err) return console.error(err);
    console.log('Delete result:', result);
  });
};

// Find people who like burritos, sort by name, limit results to 2, and hide their age
const findBurritoLovers = async () => {
  await Person.find({ favoriteFoods: 'burrito' })
    .sort({ name: 1 })
    .limit(2)
    .select('-age') // Exclude the age field
    .exec((err, data) => {
      if (err) return console.error(err);
      console.log('Burrito lovers:', data);
    });
};

// Example usage
const run = async () => {
  await createPerson('Alice', 30, ['pizza', 'burrito']);
  await createMultiplePeople([
    { name: 'Bob', age: 25, favoriteFoods: ['sushi'] },
    { name: 'Mary', age: 22, favoriteFoods: ['tacos'] }
  ]);
  await findByName('Alice');
  await findByFavoriteFood('burrito');

  // Use actual valid Object IDs from your database
  const personId1 = '64b0b9e2c7f9c947f1a0575b'; // Replace with actual ID
  const personId2 = '64b0b9e2c7f9c947f1a0575c'; // Replace with actual ID

  await findById(personId1); 
  await updateFavoriteFoods(personId1); 
  await updateAgeByName('Bob');
  await deleteById(personId2); // Use a valid ID here
  await deleteManyByName('Mary');
  await findBurritoLovers();
};

run()
  .then(() => mongoose.connection.close()) // Run the function and close the connection
  .catch(err => console.error('Error in run:', err)); // Handle any errors