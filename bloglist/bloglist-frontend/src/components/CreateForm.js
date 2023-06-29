import PropTypes from 'prop-types';
import { useState } from 'react';

const CreateForm = ({ handleSubmit }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const create = (event) => {
    event.preventDefault();
    const newBlog = {
      title: title,
      author: author,
      url: url,
    };
    setTitle('');
    setAuthor('');
    setUrl('');
    handleSubmit(newBlog);
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label className="label">
              <span className="label-text">title:</span>
            </label>
            <input
              className="input-bordered input-primary input w-full max-w-xs "
              id="title"
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div className="sm:col-span-4">
            <label className="label">
              <span className="label-text">author:</span>
            </label>
            <input
              className="input-bordered input-primary input w-full max-w-xs"
              id="author"
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div className="sm:col-span-4">
            <label className="label">
              <span className="label-text">url:</span>
            </label>
            <input
              className="input-bordered input-primary input w-full max-w-xs"
              id="url"
              type="text"
              value={url}
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <div className="row-start-4">
            <button
              className="btn"
              id="create-button"
              type="submit"
            >
              create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

CreateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default CreateForm;
