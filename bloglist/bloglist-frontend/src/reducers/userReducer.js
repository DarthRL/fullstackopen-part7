import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: {current: null, all:[]},
  reducers: {
    setUser(state, action) {
      state.current = action.payload
    },
    setUsers(state, action) {
      state.all = action.payload
    },
    clearUser(state) {
      state.current = null
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

export const {setUser, clearUser, setUsers} = userSlice.actions
export default userSlice.reducer
