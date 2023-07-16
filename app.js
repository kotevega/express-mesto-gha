const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

const { PORT = 3000 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: '64b3c523545c288b41af9a87',
  };

  next();
});

app.use(express.json());
app.use(router);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страница не найдена' });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.listen(PORT, () => {
  console.log(`Слушаем ${PORT} порт`);
});
