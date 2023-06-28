const Blog = ({ blog, handleLike, handleRemove, user }) => {
  if (!blog) return null

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
      <ul>
        {blog.comments.map((c, index) => <li key={index}>c</li>)}
      </ul>
    </div>
  )
}

export default Blog
