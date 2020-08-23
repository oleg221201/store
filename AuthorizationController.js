const pool = require("./db")

class AuthorizationController {
    async registration(req, res) {
        if (!req.body) return res.sendStatus(400)
        if (req.body.username === "" || req.body.password === "") {
            return res.render('error', {props: "Empty input"})
        }
        let name = req.body.username
        let command = "SELECT * FROM users WHERE username = ($1)"
        await pool.query(command, [name], async (error, result) => {
            if (error) return res.render('error', {props: "Bad request to db"})
            if (result.rows.length === 0) {
                let user = [req.body.username, req.body.password]
                let command1 = "INSERT INTO users (username, password) VALUES ($1, $2)"
                await pool.query(command1, user, (error, result) => {
                    if (error) return res.sendStatus(400)
                    console.log(result)
                })
                pool.query("SELECT * FROM users WHERE username = ($1) AND password = ($2)", user, (error, result) => {
                    if (error) return console.log("Bad request to db")
                    let userID = result.rows[0].user_id
                    let userName = result.rows[0].username
                    addCurrentUser(userID, userName)
                })
                res.redirect("/profile")
            } else {
                res.render('error', {props: "User exists"})
            }
        })
    }

    async sign_in(req, res) {
        if (!req.body) return res.sendStatus(400)
        if (req.body.username === "" || req.body.password === "") {
            return res.render('error', {props: "Empty input"})
        }
        let user = [req.body.username, req.body.password]
        let command = "SELECT * FROM users WHERE username = ($1) AND password = ($2)"
        await pool.query(command, user, (error, result) => {
            if (error) return res.render('error', {props: "Bad request to db"})
            if (result.rows.length === 0) {
                res.render('error', {props: "Incorrect data"})
            } else {
                let userID = result.rows[0].user_id
                let userName = result.rows[0].username
                addCurrentUser(userID, userName)
                res.redirect("/profile")
            }
        })
    }

    // This part of code doesn't work
    // If i call this func, result will be undefined
    // getCurrentUserID() {
    //     let userID = pool.query("SELECT * FROM currentUser", (error, result) => {
    //         if (error) return console.log("Bad request to db")
    //         console.log(result.rows[0].user_id)    // display normal result
    //         return result.rows[0].user_id
    //     })
    //     console.log(userID)     // display undefined
    //     return userID
    // }
}

async function addCurrentUser(userID, userName) {
    let checkCommand = "SELECT * FROM currentUser"
    let addCommand = "INSERT INTO currentUser (user_id, user_name) VALUES ($1, $2)"
    await pool.query(checkCommand, async (error, result) => {
        if (error) return console.log("Bad request to db")
        let user = [userID, userName]
        await pool.query(addCommand, user, (error, result) => {
            if (error) return console.log("Bad request to db")
        })
    })
}


module.exports = AuthorizationController