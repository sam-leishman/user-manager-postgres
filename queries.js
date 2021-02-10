//const Pool = require('pg').Pool
const Pool = require('pg-pool');
const url = require('url');

const params = url.parse(process.env.DATABASE_URL);
// const params = url.parse(process.env.STUDENT_DATABASE_URL);
const auth = params.auth.split(':');
let SSL = process.env.SSL || { rejectUnauthorized: false };
if (SSL === 'false') {
    SSL = false;
}

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: SSL
};
console.log(config);

const pool = new Pool(config);
const getUsers = (request, response) => {
    console.log(`db getUsers`);
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}