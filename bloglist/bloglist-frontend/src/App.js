import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import CreateForm from './components/CreateForm';
import Togglable from './components/Togglable';
import loginService from './services/login';
import userService from './services/users';
import { showMessage } from './reducers/messageReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
  createBlog,
  deleteBlog,
  initializeBlogs,
  likeBlog,
} from './reducers/blogReducer';
import {
  clearUserAndToken,
  setUserAndToken,
  setUsers,
} from './reducers/userReducer';

import {
  Route,
  Routes,
  Navigate,
  useMatch,
  Link,
  useNavigate,
} from 'react-router-dom';
import Users from './components/Users';
import User from './components/User';

import styles from './index.css';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const blogs = useSelector((state) => state.blogs);
  const blogMatch = useMatch('/blogs/:id');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const user = useSelector((state) => state.user.current);
  const users = useSelector((state) => state.user.all);
  const userMatch = useMatch('/users/:id');

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs());

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUserAndToken(user));
    }

    userService.getAll().then((data) => dispatch(setUsers(data)));
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      dispatch(setUserAndToken(user));
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      setUsername('');
      setPassword('');
    } catch (exception) {
      showMessage(exception.response.data.error, 'error');
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      window.localStorage.removeItem('loggedBlogappUser');
      dispatch(clearUserAndToken());
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleCreate = async (newBlog) => {
    try {
      await dispatch(createBlog(newBlog));
      dispatch(
        showMessage(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          'notification'
        )
      );
    } catch (exception) {
      dispatch(showMessage(exception.message, 'error'));
      return;
    }
    blogFormRef.current.toggleVisibility();
  };

  const handleLike = async (blog) => {
    try {
      await dispatch(likeBlog(blog.id));
    } catch (exception) {
      dispatch(showMessage(exception.message, 'error'));
      return;
    }
  };

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await dispatch(deleteBlog(blog.id));
        dispatch(
          showMessage(
            `blog ${blog.title} by ${blog.author} removed`,
            'notification'
          )
        );
        navigate('/');
      } catch (exception) {
        dispatch(showMessage(exception.message, 'error'));
      }
    }
  };

  const blogToShow = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null;
  const userToShow = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null;

  if (user === null) {
    return (
      <div className='prose m-auto'>
        <h2 className="">Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            <label className="label inline-block">
              <div className="label-text">username</div>
            </label>
            <input
              className="input-bordered input-primary input w-full max-w-xs"
              id="username"
              type="text"
              value={username}
              name="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label className="label inline-block">
              <div className="label-text">password</div>
            </label>
            <input
              className="input-bordered input-primary input w-full max-w-xs"
              id="password"
              type="text"
              value={password}
              name="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button className="btn" id="login-button" type="submit">
            login
          </button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <div className="navbar bg-base-300">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn-ghost btn lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <Link to="/">blog</Link>
              </li>
              <li>
                <Link to="/users"> users </Link>
              </li>
            </ul>
          </div>
          <Link className="btn-ghost btn text-xl normal-case" to="/">
            blog app
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">blog</Link>
            </li>
            <li>
              <Link to="/users"> users </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <div className="">{user.name} logged in </div>
          <a className="btn" onClick={handleLogout}>
            logout
          </a>
        </div>
      </div>
      <div className="prose m-auto">
        <Notification />

        <Routes>
          <Route
            path="/users"
            element={user ? <Users /> : <Navigate replace to="/" />}
          />
          <Route
            path="/users/:id"
            element={
              user ? <User user={userToShow} /> : <Navigate replace to="/" />
            }
          />
          <Route
            path="/blogs/:id"
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
            path="/"
            element={
              <div>
                <Togglable buttonLabel="new note" ref={blogFormRef}>
                  <CreateForm handleSubmit={handleCreate} />
                </Togglable>
                {[...blogs]
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
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
    </div>
  );
};

export default App;
