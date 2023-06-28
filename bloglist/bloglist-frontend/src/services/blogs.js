import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  if (newToken === null) {
    token = null
    return
  }
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response
}

const comment = async (id, object) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, object)
  return response.data
}

export default { getAll, create, setToken, update, deleteBlog, comment }