const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

// Model
const Post = require('../../models/Post');

dotenv.config({ path: './config.env' });

// Database local
// const dbLocal = process.env.DATABASE_LOCAL;

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// MongoDB Atlas

// MongoDB connection
mongoose
  .connect(db, {
    // .connect(dbLocal, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`Connected to MongoDB š ā ${db}`))
  // .then(() => console.log(`Connected to MongoDB š ā ${dbLocal}`))
  .catch((err) => console.error(`Could not connect to MongoDb ā ${err}`));

// Read JSON file
const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, 'utf-8'));

// Import data into DB
const importData = async () => {
  try {
    await Post.create(posts);

    console.log('ššš Data successfully loaded! ššš');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

// Delete all data in the DB
const deleteData = async () => {
  try {
    console.log('š¢š¢ Goodbye Data...');

    await Post.deleteMany();

    console.log(
      'Data successfully deleted! To load sample data, run\n\n\t npm run sample\n\n'
    );
    process.exit();
  } catch (err) {
    console.log(
      '\nšššššššš Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
    );
    console.error(err);
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
