const express = require('express');
const path = require('path');

const app = express();
const PORT = 3400;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.use(express.static(path.join(__dirname, '../client/dist')));

apis = require('./routes/apis');
app.use(
  '/api',
  apis
);

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname,'../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});