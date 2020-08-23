const express = require("express")
const router = express.Router()
const pool = require("../db")


router.get('/profile', async (req, res) => {
    await pool.query("SELECT * FROM currentUser", async (error, result) => {
        if (error) return res.render('error', {props: "Bad request to db"})
        let userID = result.rows[0].user_id
        let userName = result.rows[0].user_name
        let command = "SELECT * FROM items WHERE owner_id = $1"
        await pool.query(command, [userID], (err, result1) => {
            if (err) return res.sendStatus(400)
            let items = result1.rows
            items.reverse()
            res.render('profile', {items: items, userID: userID, userName: userName})
        })
    })
})

module.exports = router