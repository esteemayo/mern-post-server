const mongoose = require('mongoose');
const config = require('config');

const dbLocal = process.env.DATABASE_LOCAL;

// Use this for testing
// const db = config.get('db');

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

module.exports = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => console.log(`Connected to MongoDB → ${db}`));
};
