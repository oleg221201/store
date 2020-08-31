const models = require('./db_models')
const {Op} = require("sequelize");

class ItemsController {
    display(req, res) {
        models.Item.findOne({raw: true, where: {id: req.params.item_id}}).then(result => {
            models.User.findByPk(result.userId, {raw: true}).then(result1 => {
                let userName = result1.username
                return res.render('item_details', {item: result, userName: userName})
            }).catch(err => {
                console.log(err.message);
                res.render('error', {props: "Bad request to db users"})
            })
        }).catch(err => {
            console.log(err.message);
            res.render('error', {props: "Bad request to db items"})
        })
    }

    create(req, res) {
        if (!req.body) return res.sendStatus(400)
        if (req.body.name === "" || req.body.price === "" ||
            req.body.size === "" || req.body.city === "") {
            res.render('error', {props: "Empty input"})
        } else {
            models.CurrentUser.findAll({raw: true}).then(result => {
                console.log(result[0].user_id)
                models.User.findByPk(result[0].user_id).then(result1 => {
                    result1.createItem({
                        item_name: req.body.name, price: req.body.price,
                        size: req.body.size, city: req.body.city
                    }).then(result2 => {
                        res.redirect('/main')
                    }).catch(err => {
                        console.log(err.message);
                        res.render('error', {props: "Bad request to db items"})
                    })
                }).catch(err => {
                    console.log(err.message);
                    res.render('error', {props: "Bad request to db users"})
                })
            }).catch(err => {
                console.log(err.message);
                res.render('error', {props: "Bad request to db currentuser"})
            })
        }
    }

    change(req, res) {
        if (!req.body) return res.sendStatus(400)
        if (req.body.name === "" || req.body.price === "" ||
            req.body.size === "" || req.body.city === "") {
            res.render('error', {props: "Empty input"})
        } else {
            console.log(req.params.item_id)
            models.Item.update({
                item_name: req.body.name, price: req.body.price,
                size: req.body.size, city: req.body.city
            }, {where: {id: req.params.item_id}}).then(result => {
                res.redirect("/profile")
            }).catch(err => {
                console.log(err.message);
                res.render('error', {props: "Bad request to db items"})
            })
        }
    }

    open_edit_page(req, res) {
        models.Item.findByPk(req.params.item_id, {raw: true}).then(result => {
            res.render('edit_item', {item: result})
        }).catch(err => {
            console.log(err.message);
            res.render('error', {props: "Bad request to db items"})
        })
    }

    delete(req, res) {
        models.Item.destroy({where: {id: req.params.item_id}}).then(result => {
            res.redirect('/profile')
        }).catch(err => {
            console.log(err.message);
            res.render('error', {props: "Bad request to db items"})
        })
    }

    filter(req, res) {
        if (!req.body) return res.sendStatus(400)
        let command = {}
        if (req.body.price_from !== "" && req.body.price_to !== "") {
            command.price = {[Op.between]: [parseInt(req.body.price_from), parseInt(req.body.price_to)]}
        } else {
            if (req.body.price_from !== "") command.price = {[Op.gte]: parseInt(req.body.price_from)}
            if (req.body.price_to !== "") command.price = {[Op.lte]: parseInt(req.body.price_to)}
        }
        if (req.body.size_from !== "" && req.body.size_to !== "") {
            command.size = {[Op.between]: [parseInt(req.body.size_from), parseInt(req.body.size_to)]}
        } else {
            if (req.body.size_from !== "") command.size = {[Op.gte]: parseInt(req.body.size_from)}
            if (req.body.size_to !== "") command.size = {[Op.lte]: parseInt(req.body.size_to)}
        }
        if (req.body.city !== "") command.city = {[Op.eq]: req.body.city}
        if (Object.keys(command).length === 0) return res.render('error', {props: "No filter data"})

        models.Item.findAll({where: command, raw: true}).then(result => {
            models.Item.findAll({attributes: ['city'], raw: true}).then(result1 => {
                let cities = [], arr = []
                for (let i = 0; i < result1.length; i++) {
                    if (!arr.includes(result1[i].city)) {
                        cities.push({city: result1[i].city}), arr.push(result1[i].city)
                    }
                }
                res.render('main', {items: result, cities: cities})
            }).catch(err => {
                console.log(err.message);
                res.render('error', {props: "Bad request to db items"})
            })
        }).catch(err => {
            console.log(err.message);
            res.render('error', {props: "Bad request to db items"})
        })
    }

    sort(req, res) {
        if (!req.body) return res.sendStatus(400)
        models.Item.findAll({attributes: ['city'], raw: true}).then(result1 => {
            let cities = [], arr = []
            for (let i = 0; i < result1.length; i++) {
                if (!arr.includes(result1[i].city)) {
                    cities.push({city: result1[i].city}), arr.push(result1[i].city)
                }
            }
            switch (req.body.sortType) {
                case "Price max->min":
                    models.Item.findAll({raw: true, order: [["price", "DESC"]]}).then(result => {
                        res.render('main', {items: result, cities: cities})
                    }).catch(err => {
                        console.log(err.message);
                        res.render('error', {props: "Bad request to db items"})
                    })
                    break
                case "Price min->max":
                    models.Item.findAll({raw: true, order: ["price"]}).then(result => {
                        res.render('main', {items: result, cities: cities})
                    }).catch(err => {
                        console.log(err.message);
                        res.render('error', {props: "Bad request to db items"})
                    })
                    break
                case "Size max->min":
                    models.Item.findAll({raw: true, order: [["size", "DESC"]]}).then(result => {
                        res.render('main', {items: result, cities: cities})
                    }).catch(err => {
                        console.log(err.message);
                        res.render('error', {props: "Bad request to db items"})
                    })
                    break
                case "Size min->max":
                    models.Item.findAll({raw: true, order: ["size"]}).then(result => {
                        res.render('main', {items: result, cities: cities})
                    }).catch(err => {
                        console.log(err.message);
                        res.render('error', {props: "Bad request to db items"})
                    })
                    break
                case "Owner":
                    models.Item.findAll({raw: true, order: ["userId"]}).then(result => {
                        res.render('main', {items: result, cities: cities})
                    }).catch(err => {
                        console.log(err.message);
                        res.render('error', {props: "Bad request to db items"})
                    })
                    break
                case 'City':
                    models.Item.findAll({raw: true, order: ["city"]}).then(result => {
                        res.render('main', {items: result, cities: cities})
                    }).catch(err => {
                        console.log(err.message);
                        res.render('error', {props: "Bad request to db items"})
                    })
                    break
                default:
                    res.render('error', {props: "No sort data"})
            }
        }).catch(err => {
            console.log(err.message);
            res.render('error', {props: "Bad request to db items"})
        })
    }
}

module.exports = ItemsController