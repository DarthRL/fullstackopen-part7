import { useState } from 'react';
import blogServices from '../services/blogs';
import { useDispatch, useSelector } from 'react-redux';
import { setBlogs } from '../reducers/blogReducer';

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const [comment, setComment] = useState('');
  if (!blog) return null;

  const addComment = async (event) => {
    event.preventDefault();
    const object = { comment: comment };
    setComment('');
    const newBlog = await blogServices.comment(blog.id, object);
    dispatch(setBlogs(blogs.map((b) => (b.id !== blog.id ? b : newBlog))));
  };

  const showWhenRemoveVisible = {
    display: blog.user.username === user.username ? '' : 'none',
  };
  return (
    <div>
      <h2>
        {blog.title} {blog.author}{' '}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes
        <button className="btn" onClick={() => handleLike(blog)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          like
        </button>
      </div>
      <div>added by {blog.user.name}</div>
      <div>
        <button
          className="btn"
          style={showWhenRemoveVisible}
          onClick={() => handleRemove(blog)}
        >
          remove
        </button>
      </div>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input
          className="input-bordered input-primary input w-full max-w-xs"
          id="comment"
          type="text"
          value={comment}
          name="comment"
          onChange={({ target }) => setComment(target.value)}
        />
        <button className="btn" id="add-comment" type="submit">
          add comment
        </button>
      </form>
      <ul>
        {blog.comments.map((c, index) => (
          <li key={index}>{c}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;
