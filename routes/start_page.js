const express = require("express")
const router = express.Router()
const pool = require('../db')

router.get('/', (req, res) => {
    let cleanCommand = "TRUNCATE TABLE currentUser"
    pool.query(cleanCommand, (error, result) => {
        if (error) return console.log("Bad request to db")
    })
    res.render('start_page')
})

module.exports = router