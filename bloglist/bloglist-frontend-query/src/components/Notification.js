const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  if (message === null) {
    return null;
  }
  if (message.type === 'notification') {
    return (
      <div className='notification' style={notificationStyle}>
        {message.text}
      </div>
    );
  }
  if (message.type === 'error') {
    return (
      <div className='error' style={errorStyle}>
        {message.text}
      </div>
    );
  }
};

export default Notification;
