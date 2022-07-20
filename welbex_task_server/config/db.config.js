const { Client } = require('pg')

const client = new Client({
    host: "localhost",
    user: "welbex",
    port: 5432,
    password: "qwerty123",
    database: "welbex_db"
})

module.exports = client