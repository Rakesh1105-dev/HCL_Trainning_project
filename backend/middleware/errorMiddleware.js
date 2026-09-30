const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    const validationMessages = Object.values(err.errors).map((item) => item.message);
    return res.status(400).json({
      success: false,
      message: validationMessages.join(', '),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid MongoDB ObjectId format',
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : message,
  });
};

export default errorMiddleware;
