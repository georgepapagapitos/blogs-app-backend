const { favoriteBlog } = require('../utils/list_helper');
const { initialBlogs } = require('./test_helper');

describe('favorite blog', () => {
  test('of blogs array', () => {
    expect(favoriteBlog(initialBlogs)).toEqual(initialBlogs[2]);
  });
});