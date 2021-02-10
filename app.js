const express = require('express');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }))

// api for the client
app.get('/users', db.getUsers)

app.post('/createUser', db.addUser)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})