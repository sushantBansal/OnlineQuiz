const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env.env' });

// Load models
const User = require('./models/User');
const Category = require('./models/Category');
const Question = require('./models/Question');
const Quiz = require('./models/Quiz');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/categories.json`, 'utf-8')
);

const questions = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/questions.json`, 'utf-8')
);

const quizes = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/quizes.json`, 'utf-8')
);


// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Category.create(categories)
    await Question.create(questions)
    await Quiz.create(quizes)
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {

    await User.deleteMany();
    await Category.deleteMany()
    await Question.deleteMany()
    await Quiz.deleteMany()
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
