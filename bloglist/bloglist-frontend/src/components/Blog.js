import { useState } from 'react'
import blogServices from '../services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { setBlogs } from '../reducers/blogReducer'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const [comment, setComment] = useState('')
  if (!blog) return null

  const addComment = async (event) => {
    event.preventDefault()
    const object = {comment:comment}
    setComment('')
    const newBlog = await blogServices.comment(blog.id, object)
    dispatch(setBlogs(blogs.map(b => b.id !== blog.id ? b : newBlog)))
  }

  const showWhenRemoveVisible = {
    display: blog.user.username === user.username ? '' : 'none',
  }
  return (
    <div>
      <h2>
        {blog.title} {blog.author}{' '}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        {blog.likes} likes<button onClick={() => handleLike(blog)}>like</button>
      </div>
      <div>added by{blog.user.name}</div>
      <div>
        <button
          style={showWhenRemoveVisible}
          onClick={() => handleRemove(blog)}
        >
          remove
        </button>
      </div>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input
          id='comment'
          type='text'
          value={comment}
          name='comment'
          onChange={({ target }) => setComment(target.value)}
        />
        <button id='add-comment' type='submit'>
          add comment
        </button>
      </form>
      <ul>
        {blog.comments.map((c, index) => (
          <li key={index}>{c}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
