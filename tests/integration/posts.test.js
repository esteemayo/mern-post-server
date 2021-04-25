const request = require('supertest');
const mongoose = require('mongoose');

const Post = require('../../models/Post');

let server;

describe('/api/v1/posts', () => {
  beforeAll(() => jest.setTimeout(30000));
  beforeEach(() => {
    server = require('../../server');
  });

  afterEach(async () => {
    await server.close();
    await Post.deleteMany();
  });

  describe('GET /', () => {
    it('should return all posts', async () => {
      const posts = [
        {
          title: 'Testing the post 1',
          body: 'Testing lorem ipsum dolor sit amet!',
        },
        {
          title: 'Testing the post 2',
          body: 'Testing donec non libero et est bibendum cursus.',
        },
      ];

      await Post.collection.insertMany(posts);

      const res = await request(server).get('/api/v1/posts');

      expect(res.status).toBe(200);
      expect(res.body.data.docs.length).toBe(2);
      expect(
        res.body.data.docs.some((p) => p.title === 'Testing the post 1')
      ).toBeTruthy();
      expect(
        res.body.data.docs.some((p) => p.title === 'Testing the post 2')
      ).toBeTruthy();
      expect(
        res.body.data.docs.some(
          (p) => p.body === 'Testing lorem ipsum dolor sit amet!'
        )
      ).toBeTruthy();
      expect(
        res.body.data.docs.some(
          (p) => p.body === 'Testing donec non libero et est bibendum cursus.'
        )
      ).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    let id;
    let post;

    const exec = async () => {
      return await request(server).get(`/api/v1/posts/${id}`);
    };

    beforeEach(async () => {
      post = await Post.create({
        title: 'Testing post',
        body: 'Testing post body',
      });

      id = post._id;
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if post with the given id was not found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return the post if it is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.data.docs[0]).toHaveProperty('_id');
      expect(res.body.data.docs[0]).toHaveProperty('title', post.title);
      expect(res.body.data.docs[0]).toHaveProperty('body', post.body);
    });
  });

  describe('POST /', () => {
    let title;
    let body;

    const exec = async () => {
      return request(server).post('/api/v1/posts').send({ title, body });
    };

    beforeEach(() => {
      title = 'Testing post';
      body = 'Testing post body';
    });

    it('should return 400 if title is less than 10 characters', async () => {
      title = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if title is more than 30 characters', async () => {
      title = new Array(32).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if body is less than 10 characters', async () => {
      body = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if body is more than 700 characters', async () => {
      body = new Array(303).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save th post if it is valid', async () => {
      await exec();

      const post = await Post.find({ title: 'Tesing post' });

      expect(post).not.toBeNull();
    });

    it('should return the post if it is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(201);
      expect(res.body.data.doc).toHaveProperty('_id');
      expect(res.body.data.doc).toHaveProperty('title', 'Testing post');
      expect(res.body.data.doc).toHaveProperty('body', 'Testing post body');
    });
  });

  describe('PATCH /:id', () => {
    let newTitle;
    let newBody;
    let post;
    let id;

    const exec = async () => {
      return request(server)
        .patch(`/api/v1/posts/${id}`)
        .send({ title: newTitle, body: newBody });
    };

    beforeEach(async () => {
      post = await Post.create({
        title: 'Testing post',
        body: 'Testing post body',
      });

      id = post._id;
      newTitle = 'Updated the title';
      newBody = 'Updated the body';
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no post was found with the given id', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 400 if title is less than 10 characters', async () => {
      newTitle = '123456789';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if body is more than 30 characters', async () => {
      newbody = new Array(33).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if body is less than 10 characters', async () => {
      newBody = '123456789';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if body is more than 700 characters', async () => {
      newBody = new Array(303).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should update the post if input is valid', async () => {
      const res = await exec();

      const updatedPost = await Post.findById(id);

      expect(res.status).toBe(200);
      expect(updatedPost).toBeTruthy();
    });

    it('should return the post if input is valid', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body.data.doc).toHaveProperty('_id');
      expect(res.body.data.doc).toHaveProperty('title', newTitle);
      expect(res.body.data.doc).toHaveProperty('body', newBody);
    });
  });

  describe('DELETE /:id', () => {
    let post;
    let id;

    const exec = async () => {
      return request(server).delete(`/api/v1/posts/${id}`).send();
    };

    beforeEach(async () => {
      post = await Post.create({
        title: 'Testing post',
        body: 'Testing post body',
      });

      id = post._id;
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no post was found with the given id', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the post if input is valid', async () => {
      await exec();

      const postInDb = await Post.findById(id);

      expect(postInDb).toBeNull();
    });

    it('should return 204 if genre was successfully deleted', async () => {
      const res = await exec();

      expect(res.status).toBe(204);
    });
  });
});
