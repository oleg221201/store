const {Pool} = require("pg")

const pool = new Pool({
    user: "db_user",
    password: "password",
    host: "localhost",
    port: 5432,
    database: "store"
})

module.exports = pool