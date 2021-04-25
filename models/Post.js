const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A post must have a name'],
    minlength: [10, 'A post title must have more or equal than 10 characters'],
    maxlength: [30, 'A post title must have less or equal than 30 characters'],
    trim: true,
  },
  body: {
    type: String,
    required: [true, 'A post must have a body'],
    minlength: [10, 'A post title must have more or equal than 10 characters'],
    maxlength: [
      700,
      'A post title must have less or equal than 700 characters',
    ],
    trim: true,
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

postSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();

  this.slug = slugify(this.title, { lower: true });

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const postWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (postWithSlug.length) {
    this.slug = `${this.slug}-${postWithSlug.length + 1}`;
  }

  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
