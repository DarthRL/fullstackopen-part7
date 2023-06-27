import PropTypes from 'prop-types'
import { useState } from 'react'

const CreateForm = ({
  handleSubmit
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const create = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    setTitle('')
    setAuthor('')
    setUrl('')
    handleSubmit(newBlog)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div>title:<input
          id='title'
          type='text'
          value={title}
          name='title'
          onChange={({ target }) => setTitle(target.value)}
        /></div>
        <div>author:<input
          id='author'
          type='text'
          value={author}
          name='author'
          onChange={({ target }) => setAuthor(target.value)}
        /></div>
        <div>url:<input
          id='url'
          type='text'
          value={url}
          name='url'
          onChange={({ target }) => setUrl(target.value)}
        /></div>
        <button id='create-button' type='submit'>create</button>
      </form>
    </div>
  )
}

CreateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default CreateForm