import { createContext, useContext, useReducer } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return null
  }
}

const UserContext = createContext()

export const UserContextProvider = props => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[0]
}
export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[1]
}

export default UserContext
