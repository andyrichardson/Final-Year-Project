module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV == 'development') {
    console.log(err);
  }

  const error = {
    message: err.message,
    status: err.status,
  };

  // Validation errors
  if (err.message && error.message.toUpperCase().includes('VALIDATION')) {
    error.status = 400;
  }

  // Other errors
  switch (error.message) {
    case 'Not found':
      error.status = 404;
      break;

    default:
      error.status = (error.status === undefined) ? 500 : error.status;
      break;
  }

  res.status(error.status);
  res.json(error);
};
