const Sequelize = require("sequelize");
// const sequelize = new Sequelize("store", "db_user", "password", {
//     dialect: "postgres",
//     host: "localhost",
//     port: 5432,
//     define: {
//         timestamps: false
//     }
// });
const  sequelize = new Sequelize("postgres://prrlmonn:oWw5VyE8rrSoVTTJdlTo7TXMqW8NZYWa@kandula.db.elephantsql.com:5432/prrlmonn")
module.exports = sequelize