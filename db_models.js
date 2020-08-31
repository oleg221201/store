const Sequelize = require('sequelize')
const sequelize = require('./db')

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const Item = sequelize.define('item', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    item_name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    price:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    size:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    city:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

const CurrentUser = sequelize.define('currentuser', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        // primaryKey: true,
        allowNull: false
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

User.hasMany(Item)

module.exports = {
    User: User,
    Item: Item,
    CurrentUser: CurrentUser
}