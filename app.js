const AuthorizationController = require("./AuthorizationController")
const authorizationController = new AuthorizationController()
const ItemsController = require("./ItemsController")
const itemsController = new ItemsController()

const sequelize = require('./db')
const bodyParser = require('body-parser');
const express = require("express");
const app = express();

const startPageRouter = require('./routes/start_page')
const profileRouter = require('./routes/profile')
const mainRouter = require('./routes/main')
const registrationRouter = require('./routes/registration')
const signInRouter = require('./routes/sign_in')
const signOutRouter = require('./routes/sign_out')

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

try {
    sequelize.sync().then(()=>{
        app.listen(3000)
    })
    app.get('/', startPageRouter)
    app.get('/profile', profileRouter)
    app.get('/main', mainRouter)
    app.get('/registration', registrationRouter)
    app.get('/sign_in', signInRouter)
    app.get('/sign_out', signOutRouter)

    app.get("/profile/:item_id", itemsController.display)
    app.get("/profile/delete/:item_id", itemsController.delete)
    app.get("/profile/edit/:item_id", itemsController.open_edit_page)

    app.get("/main/:item_id", itemsController.display)

    app.post("/profile", itemsController.create)
    app.post("/profile/edit/:item_id", itemsController.change)

    app.post('/main/filter', itemsController.filter)
    app.post("/main/sort", itemsController.sort)

    app.post("/registration", authorizationController.registration)
    app.post("/sign_in", authorizationController.sign_in)
} catch (err) {return console.log(err.message)}

