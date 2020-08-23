const express = require("express")
const router = express.Router()

router.get('/sign_out', (req, res) => {
    res.redirect('/')
})

module.exports = router