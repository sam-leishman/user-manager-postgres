const express = require('express');
// const path = require('path');
// const db = require('./queries');

const app = express();
const port = process.env.PORT || 3000;
console.log(`app name = ${process.env.APP_NAME}`);

app.use(express.urlencoded({ extended: false }))

// api for the client
app.get('/users', (req, res) => {
    res.send('all users')
})

app.post('/createUser', (req, res) => {
    res.send('new user created')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})