const express = require('express');
const app = express();

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => console.log('ok'));
