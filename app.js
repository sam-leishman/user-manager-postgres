const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// api for the client
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/form', (req, res) => {
    res.render('form')
})

app.get('/users', db.getUsers);

app.post('/createUser', db.addUser);

app.get('/edit/:id', db.editPage);
app.post('/edit/:id', db.updateUser);

app.post('/deleteUser/:id', db.deleteUser);

app.post('/filter', db.sortUsers)

app.post('/search', db.searchUsers);


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})