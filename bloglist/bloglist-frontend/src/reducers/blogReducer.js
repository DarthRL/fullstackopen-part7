import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    likeLocally(state, action) {
      const id = action.payload
      const blogToChange = state.find((b) => b.id === id)
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1,
      }
      return state.map((b) => (b.id !== id ? b : changedBlog))
    },
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

export const like = (id) => {
  return async (dispatch, getState) => {
    dispatch(likeLocally(id))
    const changedBlog = {
      likes: getState().blogs.find((b) => b.id === id).likes,
    }
    await blogService.update(id, changedBlog)
  }
}

export const { appendBlog, setBlogs, likeLocally } = blogSlice.actions
export default blogSlice.reducer
