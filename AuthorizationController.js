const models = require("./db_models")

class AuthorizationController {
    async registration(req, res) {
        if (!req.body) return res.sendStatus(400)
        if (req.body.username === "" || req.body.password === "") {
            return res.render('error', {props: "Empty input"})
        }
        let name = req.body.username
        await models.User.findOne({where: {username: name}}).then(async result => {
            if (result === null) {
                await models.User.create({username: req.body.username, password: req.body.password})
                    .then(result1 => {
                        addCurrentUser(result1.dataValues.id, req.body.username)
                    })
                    .catch(err => {
                        res.render('error', {props: "Bad request to db users"})
                    })
                res.redirect("/main")
            } else {
                res.render('error', {props: "User exists"})
            }
        }).catch(err => {
            console.log(err.message);
            res.render('error', {props: "Bad request to db users"})
        })
    }

    async sign_in(req, res) {
        if (!req.body) return res.sendStatus(400)
        if (req.body.username === "" || req.body.password === "") {
            return res.render('error', {props: "Empty input"})
        }
        await models.User.findOne({where: {username: req.body.username, password: req.body.password}}).then(result => {
            if (result === null) {
                res.render('error', {props: "Incorrect data"})
            } else {
                addCurrentUser(result.dataValues.id, req.body.username)
                res.redirect("/main")
            }
        }).catch(err => {
            console.log(err.message);
            res.render('error', {props: "Bad request to db users"})
        })
    }
}

async function addCurrentUser(userID, userName) {
    await models.CurrentUser.findAll({raw: true}).then(async result => {
        if (result.length !== 0) {
            await models.CurrentUser.update({user_id: userID, user_name: userName}, {where: {id: 1}})
                .then(result1 => {})
                .catch(err => {return console.log(err.message)})
        } else {
            await models.CurrentUser.create({id: 1, user_id: userID, user_name: userName})
                .then(result1 => {})
                .catch(err => {return console.log(err.message)})
        }
    }).catch(err => {
        return console.log(err.message)
    })
}


module.exports = AuthorizationController