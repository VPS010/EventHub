const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        msg: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;