const express = require("express")
const router = express.Router()
const models = require('../db_models')

router.get('/main', (req, res) => {
    models.Item.findAll({raw: true}).then(result => {
        let cities = [], arr = []
        for (let i = 0; i < result.length; i++) {
            if (!arr.includes(result[i].city)) {
                cities.push({city: result[i].city}), arr.push(result[i].city)
            }
        }
        res.render('main', {items: result.reverse(), cities: cities})
    }).catch(err => {
        res.render('error', {props: "Bad request to db"})
    })
})

module.exports = router