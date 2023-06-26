import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import messageReducer from './reducers/messageReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    message: messageReducer,
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
