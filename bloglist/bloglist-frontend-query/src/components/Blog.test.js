import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import CreateForm from './CreateForm'

describe('<Blog />', () => {
  let container
  let likeHandler = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'title1',
      author: 'author1',
      url: 'url1',
      likes: '2',
      user: {
        username: 'user1',
        name: 'user name1'
      }
    }
    const user = {
      username: 'user1',
      name: 'user name1'
    }
    container = render(<Blog blog={blog} user={user} handleLike={likeHandler} />).container
  })

  test('renders content', async () => {
    const title = container.querySelector('.blogTitle')
    expect(title).toBeVisible()
    expect(title).toHaveTextContent('title1 author1')
  })

  test('at start url and likes are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')

    const url = container.querySelector('.blogUrl')
    expect(url).not.toBeVisible()

    const likes = container.querySelector('.blogLikes')
    expect(likes).not.toBeVisible()
  })

  test('after clicking the button, url and likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')

    const url = container.querySelector('.blogUrl')
    expect(url).toBeVisible()
    expect(url).toHaveTextContent('url1')

    const likes = container.querySelector('.blogLikes')
    expect(likes).toBeVisible()
    expect(likes).toHaveTextContent('2')
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    expect(likeHandler.mock.calls).toHaveLength(2)
  })
})

describe('<CreateForm/>', () => {
  let container
  let submitHandler = jest.fn()

  test('submits with right details', async () => {

    container = render(<CreateForm
      handleSubmit={submitHandler} />).container
    const user = userEvent.setup()

    const titleInput = container.querySelector('input[name="title"]')
    const authorInput = container.querySelector('input[name="author"]')
    const urlInput = container.querySelector('input[name="url"]')
    const submitButton = screen.getByText('create')
    await user.type(titleInput, 'title1')
    await user.type(authorInput, 'author1')
    await user.type(urlInput, 'url1')
    await user.click(submitButton)
    expect(submitHandler.mock.calls).toHaveLength(1)
    expect(submitHandler.mock.calls[0][0]).toEqual({
      title: 'title1',
      author: 'author1',
      url: 'url1'
    })

  })
})