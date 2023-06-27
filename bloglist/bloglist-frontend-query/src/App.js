import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import CreateForm from './components/CreateForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { useMessageDispatch } from './components/MessageContextProvider'
import { useMutation, useQuery, useQueryClient } from 'react-query'

const App = () => {
  const queryClient = useQueryClient()
  const blogResults = useQuery('blogs', blogService.getAll)
  const blogs = blogResults.data
  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: newBlog => {
      const blogs = queryClient.getQueryData('blogs')
      queryClient.setQueryData('blogs', blogs.concat(newBlog))
    }
  })
  const updateBlogMutation = useMutation(blogService.update, {
    onSuccess: newBlog => {
      const blogs = queryClient.getQueryData('blogs')
      const newBlogs = blogs.map(b => b.id !== newBlog.id ? b : newBlog)
      queryClient.setQueryData('blogs', newBlogs)
    }
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const messageDispatch = useMessageDispatch()
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showMessage(exception.response.data.error, 'error')
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    try {
      blogService.setToken('')
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleCreate = async newBlog => {
    try {
      await newBlogMutation.mutateAsync(newBlog)
      showMessage(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        'notification'
      )
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      showMessage(exception.message, 'error')
    }
  }

  const handleLike = async blog => {
    try {
      await updateBlogMutation.mutateAsync({id: blog.id, newObject: {likes: blog.likes + 1}})
    } catch (exception) {
      showMessage(exception.message, 'error')
    }
  }

  const handleRemove = blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .deleteBlog(blog.id)
        .then(() => {
          showMessage(
            `blog ${blog.title} by ${blog.author} removed`,
            'notification'
          )
          //setBlogs(blogs.filter(b => b.id !== blog.id))
        })
        .catch(exception => {
          showMessage(exception.response.data.error, 'error')
        })
    }
  }

  const showMessage = (text, type) => {
    messageDispatch({ type: 'CREATE', payload: { text, type } })
    setTimeout(() => {
      messageDispatch({ type: 'CLEAR' })
    }, 5000)
  }
  if (!blogs) return <div></div>

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
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
          <button id='login-button' type='submit'>
            login
          </button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <CreateForm handleSubmit={handleCreate} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleRemove={handleRemove}
            user={user}
          />
        ))}
    </div>
  )
}

export default App
