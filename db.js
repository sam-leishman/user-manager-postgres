// api to the database
require('dotenv').config()
const Pool = require('pg').Pool;
const url = require('url');
const DBConnectionString = process.env.DATABASE_URL;

const params = url.parse(DBConnectionString);

const auth = params.auth.split(':');
let SSL = process.env.SSL || { rejectUnauthorized: false };
if (SSL === 'false') {
    SSL = false;
} else if (SSL === 'heroku') {
    SSL = { rejectUnauthorized: false };
} else {
    SSL = true;
}

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: SSL
};

const pool = new Pool(config);



// Queries
const getUsers = (req, res) => {
    let getUsersSQL = 'select * from users'
    pool.query(getUsersSQL, (err, results) => {
        if (err) throw err;
        let ordered = results.rows.sort((a, b) => (a.id > b.id) ? 1 : -1)
        res.render('users', { users: ordered })
    })
}

const addUser = (req, res) => {
    let id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const age = req.body.age;

    pool.query('select MAX(id) from users', (err, results) => {
        id = results.rows[0].max + 1;
        let addUserSQL = 'insert into users (id, first_name, last_name, email, age) values ($1, $2, $3, $4, $5)'
        pool.query(addUserSQL, [id, first_name, last_name, email, age], (err, results) => {
            if (err) throw err;
            res.redirect('/users')
        })
    })
}

const deleteUser = (req, res) => {
    const id = req.params.id;

    let deleteUserSQL = 'delete from users where id = $1'
    pool.query(deleteUserSQL, [id], (err, results) => {
        if (err) throw err;
        res.redirect('/users')
    })
}

const getUserEditPage = (req, res) => {
    let id = req.params.id

    let getUserSQL = 'select * from users where id = $1';
    pool.query(getUserSQL, [id], (err, results) => {
        if (err) throw err
        res.render('editUser', { user: results.rows[0] })
    });
}

const updateUser = (req, res) => {
    const id = req.params.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const age = req.body.age;
    
    let updateUserSQL = 'update users set first_name = $2, last_name = $3, email = $4, age = $5 where id = $1';
    pool.query(updateUserSQL, [id, first_name, last_name, email, age], (err, results) => {
        if (err) throw err
        res.redirect('/users')
    });
}

module.exports = {
    getUsers,
    addUser,
    deleteUser,
    getUserEditPage,
    updateUser
}