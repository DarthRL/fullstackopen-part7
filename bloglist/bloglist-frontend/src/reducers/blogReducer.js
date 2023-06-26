import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
  },
})

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = object => {
  return async dispatch => {
    const newBlog = await blogService.create(object)
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = id => {
  return async (dispatch, getState) => {
    const blogToChange = getState().blogs.find(b => b.id === id)
    const changedBlog = {
      ...blogToChange,
      likes: blogToChange.likes + 1,
    }
    const objectToUpload = {
      likes: changedBlog.likes,
    }
    console.log(changedBlog)
    await blogService.update(id, objectToUpload)
    dispatch(setBlogs(getState().blogs.map(b => b.id !== id ? b : changedBlog)))
  }
}

export const { appendBlog, setBlogs } = blogSlice.actions
export default blogSlice.reducer
