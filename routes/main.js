const express = require("express")
const router = express.Router()
const pool = require("../db")

router.get('/main', async (req, res) => {
    await pool.query("SELECT * FROM items", (err, result) => {
        if (err) return res.sendStatus(400)
        let items = result.rows
        items.reverse()
        res.render('main', {items: items, cities: result.rows})
    })
})

module.exports = router