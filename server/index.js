const express = require('express');

const app = express();
const PORT = 3400;

app.use(express.json());

app.get('/', async (req, res) => {
  res.send('Test');
});

apis = require('./routes/apis');
app.use(
  '/api',
  apis
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});