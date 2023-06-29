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
      <h2 >create new</h2>
      <form onSubmit={create}>
        <div className="join-vertical join">
          <div className="join-item">
            <label className="label">
              <span className="label-text">title:</span>
            </label>
            <input
              className="input-bordered input-primary input w-full max-w-xs"
              id="title"
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div className="join-item">
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
          <div className="join-item">
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
          <button
            className="join-item btn rounded-r-full"
            id="create-button"
            type="submit"
          >
            create
          </button>
        </div>
      </form>
    </div>
  );
};

CreateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default CreateForm;
