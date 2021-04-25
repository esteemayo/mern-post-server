const express = require('express');

const postController = require('../controllers/postController');
const validateObjectId = require('../middlewares/validateObjectId');

const router = express.Router();

router.get('/:limit', postController.getPostLimit);

router.get('/details/:slug', postController.getWithSlug);

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

router
  .route('/:id')
  .get(validateObjectId, postController.getPost)
  .patch(validateObjectId, postController.updatePost)
  .delete(validateObjectId, postController.deletePost);

module.exports = router;
