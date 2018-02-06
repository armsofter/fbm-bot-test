const express = require('express');
const bodyParser = require('body-parser');
const verify = require('./controllers/verification');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => console.log('Webhook server is listening, port 3000'));
app.use((req, res) => {
    verify(req, res);
})
