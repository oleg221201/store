const express = require("express")
const router = express.Router()
const models = require('../db_models')

router.get('/', async (req, res) => {
    await models.CurrentUser.destroy({
        truncate: true
    })
    res.render('start_page')
})

module.exports = router