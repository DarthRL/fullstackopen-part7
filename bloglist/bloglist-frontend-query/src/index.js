import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { MessageContextProvider } from './components/MessageContextProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
    <MessageContextProvider>
      <App />
    </MessageContextProvider>
)
