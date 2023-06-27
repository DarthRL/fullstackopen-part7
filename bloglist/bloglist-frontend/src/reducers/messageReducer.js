import { createSlice } from '@reduxjs/toolkit'

const messageSlice = createSlice({
  name: 'message',
  initialState: null,
  reducers: {
    setMessage(state, action) {
      return action.payload
    },
    clearMessage() {
      return null
    },
  },
})

export const showMessage = (text, type) => {
  return async dispatch => {
    dispatch(setMessage({ text, type }))
    setTimeout(() => {
      dispatch(setMessage(null))
    }, 5000)
  }
}
export const { setMessage, clearMessage } = messageSlice.actions
export default messageSlice.reducer
