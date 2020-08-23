const AuthorizationController = require("./AuthorizationController")
const Authorization = new AuthorizationController()
const ItemsController = require("./ItemsController")
const Items = new ItemsController()

const bodyParser = require('body-parser');
const express = require("express");
const pool = require("./db")
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

app.get('/', startPageRouter)
app.get('/profile', profileRouter)
app.get('/main', mainRouter)
app.get('/registration', registrationRouter)
app.get('/sign_in', signInRouter)
app.get('/sign_out', signOutRouter)

app.get("/profile/:item_id", Items.display)
app.get("/profile/delete/:item_id", Items.delete)
app.get("/profile/edit/:item_id", Items.open_edit_page)

app.get("/main/:item_id", Items.display)

app.post("/profile", Items.create)
app.post("/profile/edit/:item_id", Items.change)

app.post('/main/filter', Items.filter)
app.post("/main/sort", Items.sort)

app.post("/registration", Authorization.registration)
app.post("/sign_in", Authorization.sign_in)


app.listen(3000);
