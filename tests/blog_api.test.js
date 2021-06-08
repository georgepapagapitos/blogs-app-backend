const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');

const { initialBlogs, blogsInDb, usersInDb } = require('./test_helper');
const app = require('../app');

const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe('when there are initially some blogs in the db', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('the id property is properly formatted', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });
});

describe('add a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'George Papagapitos',
      url: 'www.google.com',
      likes: 4,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await blogsInDb();
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

    const titles = blogsAtEnd.map(blog => blog.title);
    expect(titles).toContain('New Blog');
  });

  test('with no likes property defaults it to 0', async () => {
    const newBlog = {
      title: 'Blog with no likes',
      author: 'George',
      url: 'www.likefree.com'
    };

    const savedBlog = await api.post('/api/blogs').send(newBlog);
    expect(savedBlog.body.likes).toBe(0);
  });

  test('with no title or url - receive a 400', async () => {
    const newBlog = {
      likes: 10
    };

    await await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const blogsAtDb = await blogsInDb();
    expect(blogsAtDb.length).toBe(initialBlogs.length);
  });
});

describe('deleting a blog', () => {
  test('with a valid id succeeds', async () => {
    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const blogsAtEnd = await blogsInDb();

    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

    const titles = blogsAtEnd.map(blog => blog.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe('updating a blogs like count', () => {
  test('succeeds on a valid blog', async () => {
    const blogs = await blogsInDb();
    const blogToUpdate = blogs[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200);
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'admin', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'newuser',
      name: 'George Papagapitos',
      password: 'password'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with invalid data', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'baduser',
      name: 'george',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(500);

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).not.toContain(newUser.username);
  });
});

afterAll(() => {
  mongoose.connection.close();
});