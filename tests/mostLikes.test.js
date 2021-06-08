const { mostLikes } = require('../utils/list_helper');
const { initialBlogs } = require('./test_helper');

describe('most likes', () => {
  test('from array of blogs', () => {
    expect(mostLikes(initialBlogs)).toEqual({ author: 'Edsger W. Dijkstra', likes: 12 });
  });
});