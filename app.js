const express = require('express');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
