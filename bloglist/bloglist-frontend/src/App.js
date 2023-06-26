import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import CreateForm from './components/CreateForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { setMessage } from './reducers/messageReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showMessage(exception.response.data.error, 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      blogService.setToken('')
      window.localStorage.removeItem(
        'loggedBlogappUser'
      )
      setUser(null)
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleCreate = (newBlog) => {
    blogService.create(newBlog)
      .then(returnedBlog => {
        showMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'notification')
        setBlogs(blogs.concat(returnedBlog))
        blogFormRef.current.toggleVisibility()
      }).catch((exception) => {
        showMessage(exception.response.data.error, 'error')
      })
  }

  const handleLike = (blog) => {
    blogService.update({
      id: blog.id,
      newObject: {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id
      }
    }).then(returnedBlog => {
      setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog))
    }).catch((exception) => {
      showMessage(exception.response.data.error, 'error')
    })
  }

  const handleRemove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.deleteBlog(blog.id).then(() => {
        showMessage(`blog ${blog.title} by ${blog.author} removed`, 'notification')
        setBlogs(blogs.filter(b => b.id !== blog.id))
      }).catch((exception) => {
        showMessage(exception.response.data.error, 'error')
      })
    }
  }

  const showMessage = (text, type) => {
    dispatch(setMessage({ text, type }))
    setTimeout(() => {
      dispatch(setMessage(null))
    }, 5000)
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification/>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id='username'
              type='text'
              value={username}
              name='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type='text'
              value={password}
              name='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-button' type='submit'>login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification/>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <CreateForm
          handleSubmit={handleCreate}
        />
      </Togglable>
      {blogs.sort((a, b) => (b.likes - a.likes))
        .map(blog =>
          <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} user={user} />
        )}
    </div>
  )
}

export default App