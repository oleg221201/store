const express = require("express")
const router = express.Router()
const models = require('../db_models')


router.get('/profile',async (req, res) => {
    await models.CurrentUser.findAll({raw:true}).then(async result=>{
        let userID = result[0].user_id
        let userName = result[0].user_name
        await models.User.findByPk(userID).then(async result1=>{
            await result1.getItems({raw: true}).then(result2=>{
                res.render('profile', {items: result2.reverse(), userID: userID, userName: userName})
            }).catch(err=>{console.log(err.message); res.render('error', {props: "Bad request to db items"})})
        }).catch(err=>{console.log(err.message); res.render('error', {props: "Bad request to db users"})})
    }).catch(err=>{console.log(err.message); res.render('error', {props: "Bad request to db currentuser"})})
})

module.exports = router