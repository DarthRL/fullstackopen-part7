import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { MessageContextProvider } from './components/MessageContextProvider'
import { QueryClient, QueryClientProvider } from 'react-query'
import { UserContextProvider } from './components/UserContextProvider'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <MessageContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </MessageContextProvider>
  </QueryClientProvider>
)
