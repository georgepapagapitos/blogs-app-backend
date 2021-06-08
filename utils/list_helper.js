const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((most, blog) => most.likes > blog.likes ? most : blog);
};

const mostBlogs = (blogs) => {
  const blogMap = _.countBy(blogs, (blog) => blog.author);
  const authorBlogCount = _.keys(blogMap).map(author => {
    return {
      author,
      blogs: blogMap[author]
    };
  });

  return authorBlogCount.reduce((pv, cv) => pv.count > cv.count ? pv : cv, {});
};

const mostLikes = (blogs) => {
  const blog = _.maxBy(blogs, (blog) => blog.likes);
  return ({
    author: blog.author,
    likes: blog.likes
  });
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };