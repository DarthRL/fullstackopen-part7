import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import CreateForm from './components/CreateForm'
import Togglable from './components/Togglable'
import loginService from './services/login'
import userService from './services/users'
import { showMessage } from './reducers/messageReducer'
import { useDispatch, useSelector } from 'react-redux'
import {
  createBlog,
  deleteBlog,
  initializeBlogs,
  likeBlog,
} from './reducers/blogReducer'
import {
  clearUserAndToken,
  setUserAndToken,
  setUsers,
} from './reducers/userReducer'

import { Route, Routes, Navigate, useMatch, Link, useNavigate } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const blogs = useSelector(state => state.blogs)
  const blogMatch = useMatch('/blogs/:id')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const user = useSelector(state => state.user.current)
  const users = useSelector(state => state.user.all)
  const userMatch = useMatch('/users/:id')

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUserAndToken(user))
    }

    userService.getAll().then(data => dispatch(setUsers(data)))
  }, [dispatch])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      dispatch(setUserAndToken(user))
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      showMessage(exception.response.data.error, 'error')
    }
  }

  const handleLogout = async event => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      dispatch(clearUserAndToken())
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleCreate = async newBlog => {
    try {
      await dispatch(createBlog(newBlog))
      dispatch(
        showMessage(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          'notification'
        )
      )
    } catch (exception) {
      dispatch(showMessage(exception.message, 'error'))
      return
    }
    blogFormRef.current.toggleVisibility()
  }

  const handleLike = async blog => {
    try {
      await dispatch(likeBlog(blog.id))
    } catch (exception) {
      dispatch(showMessage(exception.message, 'error'))
      return
    }
  }

  const handleRemove = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await dispatch(deleteBlog(blog.id))
        dispatch(
          showMessage(
            `blog ${blog.title} by ${blog.author} removed`,
            'notification'
          )
        )
        navigate('/')
      } catch (exception) {
        dispatch(showMessage(exception.message, 'error'))
      }
    }
  }

  const blogToShow = blogMatch
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null
  const userToShow = userMatch
    ? users.find(user => user.id === userMatch.params.id)
    : null

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
      <Routes>
        <Route
          path='/users'
          element={user ? <Users /> : <Navigate replace to='/' />}
        />
        <Route
          path='/users/:id'
          element={
            user ? <User user={userToShow} /> : <Navigate replace to='/' />
          }
        />
        <Route
          path='/blogs/:id'
          element={
            <Blog
              blog={blogToShow}
              handleLike={handleLike}
              handleRemove={handleRemove}
              user={user}
            />
          }
        />
        <Route
          path='/'
          element={
            <div>
              <Togglable buttonLabel='new note' ref={blogFormRef}>
                <CreateForm handleSubmit={handleCreate} />
              </Togglable>
              {[...blogs]
                .sort((a, b) => b.likes - a.likes)
                .map(blog => (
                  <div
                    key={blog.id}
                    style={{
                      paddingTop: 10,
                      paddingLeft: 2,
                      border: 'solid',
                      borderWidth: 1,
                      marginBottom: 5,
                    }}
                  >
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </div>
                ))}
            </div>
          }
        />
      </Routes>
    </div>
  )
}

export default App
