const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const app = require('../app')
mongoose.set("bufferTimeoutMS", 30000)

const api = supertest(app)
let authorization = ''

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  blogObjects.forEach(blog => blog.user = user._id)
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  authorization = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
  authorization = `Bearer ${authorization.body.token}`
}, 100000)

test('notes are returned as json with right length', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(blogs.body).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('identifier is named "id"', async () => {
  const blogs = await api.get('/api/blogs')
  blogs.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
}, 100000)

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "new blog",
    author: "new author",
    url: "new url",
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authorization)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const blogs = response.body.map(r => ({
    title: r.title,
    author: r.author,
    url: r.url,
    likes: r.likes
  }))

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(blogs).toContainEqual(newBlog)
}, 100000)

test('missing "likes" defaults to 0', async () => {
  const newBlog = {
    title: "new blog",
    author: "new author",
    url: "new url"
  }
  const newBlogWithLikes = {
    ...newBlog,
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authorization)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const blogs = response.body.map(r => ({
    title: r.title,
    author: r.author,
    url: r.url,
    likes: r.likes
  }))

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(blogs).toContainEqual(newBlogWithLikes)
}, 100000)

test('missing title or url returns 400', async () => {
  const newBlog1 = {
    author: "new author",
    url: "new url"
  }
  const newBlog2 = {
    title: "new title",
    author: "new author"
  }

  await api
    .post('/api/blogs')
    .set('Authorization', authorization)
    .send(newBlog1)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', authorization)
    .send(newBlog2)
    .expect(400)
}, 100000)

test('a valid blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', authorization)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

  expect(blogsAtEnd).not.toContainEqual(blogToDelete)
}, 100000)

test('a blog cannot be deleted without token', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

  expect(blogsAtEnd).toContainEqual(blogToDelete)
}, 100000)

test('likes can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const newBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(blog => blog.id == blogToUpdate.id)
  expect(updatedBlog.likes).toBe(blogToUpdate.likes + 1)
}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})