import { useEffect, useState } from 'react'
import userService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    userService.getAll().then(data => setUsers(data))
  }, [])

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Users
