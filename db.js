// api to the database
const Pool = require('pg').Pool;
const url = require('url');
const DBConnectionString = process.env.DATABASE_URL;

const params = url.parse(DBConnectionString);

const auth = params.auth.split(':');
let SSL = process.env.SSL || { rejectUnauthorized: false };
if (SSL === 'false') {
    SSL = false;
} else if (SSL === 'true') {
    SSL = true;
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
        console.log(results)
        res.status(200).json(results.rows)
    })
}

const addUser = (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    let addUserSQL = 'insert into users (email, name) values ($1, $2)'
    pool.query(addUserSQL, [email, name], (err, results) => {
        if (err) throw err;
        console.log(results)
        res.status(200).json(results)
    })
}

const deleteUser = (req, res) => {
    const name = req.body.name;
    let deleteUserSQL = 'delete from users where name = $1'
    pool.query(deleteUserSQL, [name], (err, results) => {
        if (err) throw err;
        console.log(results)
        res.status(200).json(results)
    })
}

const updateUser = (req, res) => {
    const name = req.body.name;
    const id = req.body.id;
    let updateUserSQL = 'update users set name = $1 where id = $2'
    pool.query(updateUserSQL, [name, id], (err, results) => {
        if (err) throw err;
        console.log(results)
        res.status(200).json(results)
    })
}

module.exports = {
    getUsers,
    addUser,
    deleteUser,
    updateUser
}