import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [detailVisible, setDetailVisible] = useState(false)

  const showWhenDetailVisible = { display: detailVisible ? '' : 'none' }
  const buttonText = detailVisible ? 'hide' : 'view'

  const toggleDetailVisible = () => {
    setDetailVisible(!detailVisible)
  }

  const showWhenRemoveVisible = { display: blog.user.username === user.username ? '' : 'none' }

  return (
    <div className = 'blog' style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleDetailVisible}>{buttonText}</button>
      <div style={showWhenDetailVisible} className='togglableContent'>
        <div className='blogUrl'>{blog.url}</div>
        <div className='blogLikes'>likes {blog.likes}<button onClick={() => handleLike(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        <div><button style={showWhenRemoveVisible} onClick={() => handleRemove(blog)}>remove</button></div>
      </div>
    </div>
  )
}

export default Blog