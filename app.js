const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: '64b3c523545c288b41af9a87',
  };

  next();
});

app.use(helmet());
app.use(express.json());
app.use(router);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страница не найдена' });
});

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.listen(PORT, () => {
  console.log(`Слушаем ${PORT} порт`);
});
