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
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (object) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(object)
    dispatch(appendBlog(newBlog))
  }
}

export const { appendBlog, setBlogs } = blogSlice.actions
export default blogSlice.reducer
