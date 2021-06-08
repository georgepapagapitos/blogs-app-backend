const { mostBlogs } = require('../utils/list_helper');
const { initialBlogs } = require('./test_helper');

describe('author with the most blogs written', () => {
  test('from test array of blogs', () => {
    expect(mostBlogs(initialBlogs)).toEqual({ author: 'Robert C. Martin', blogs: 3 });
  });
});