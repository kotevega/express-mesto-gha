const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const router = require('./routes');
const { login, createUser } = require('./controllers/users');
const errors = require('./middlewares/errors');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(router);
app.use(errors);

app.listen(PORT, () => {
  console.log(`Слушаем ${PORT} порт`);
});
