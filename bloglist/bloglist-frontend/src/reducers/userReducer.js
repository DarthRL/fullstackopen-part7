import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const setUserAndToken = (user) => {
  return async dispatch => {
    dispatch(setUser(user))
    await blogService.setToken(user.token)
  }
}

export const clearUserAndToken = () => {
  return async dispatch => {
    dispatch(clearUser())
    await blogService.setToken('')
  }
}

export const {setUser, clearUser} = userSlice.actions
export default userSlice.reducer
