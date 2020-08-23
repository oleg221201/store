const pool = require("./db")

class ItemsController {
    async display(req, res) {
        let command = "SELECT * FROM items WHERE item_id = $1"
        await pool.query(command, [req.params.item_id], async (error, result) => {
            if (error) return console.log("Bad request to db")
            let command1 = "SELECT * FROM users WHERE user_id = $1"
            await pool.query(command1, [result.rows[0].owner_id], async (error1, result1) => {
                if (error1) return res.render('error', {props: "Bad request to db"})
                let userName = result1.rows[0].username
                res.render('item_details', {item: result.rows[0], userName: userName})
            })
        })
    }

    async main_display(req, res) {
        let command = "SELECT * FROM items WHERE item_id = $1"
        await pool.query(command, [req.params.item_id], (error, result) => {
            if (error) return console.log("Bad request to db")
            res.render('item_details', {item: result.rows[0]})
        })
    }

    async create(req, res) {
        if (!req.body) return res.sendStatus(400)
        if (req.body.name === "" || req.body.price === "" ||
            req.body.size === "" || req.body.city === "") {
            res.render('error', {props: "Empty input"})
        } else {
            pool.query("SELECT * FROM currentUser", (error, result) => {
                if (error) return res.render('error', {props: "Bad request to db"})
                let item = [result.rows[0].user_id, req.body.name,
                    req.body.price, req.body.size, req.body.city]
                let command = "INSERT INTO items (owner_id, item_name, price, size, city) VALUES ($1, $2, $3, $4, $5)"
                pool.query(command, item, (error1, result1) => {
                    if (error1) return res.render('error', {props: "Bad request to db"})
                    res.redirect('/main')
                })
            })
        }
    }

    async change(req, res) {
        if (!req.body) return res.sendStatus(400)
        if (req.body.name === "" || req.body.price === "" ||
            req.body.size === "" || req.body.city === "") {
            res.render('error', {props: "Empty input"})
        } else {
            let command = "UPDATE items SET item_name = $1, price = $2, size = $3, city = $4 WHERE item_id = $5"
            let data = [req.body.name, req.body.price, req.body.size, req.body.city, req.params.item_id]
            await pool.query(command, data, (error, result) => {
                if (error) return res.render('error', {props: "Bad request to db"})
                res.redirect("/profile")
            })
        }
    }

    async open_edit_page(req, res) {
        let command = "SELECT * FROM items WHERE item_id = $1"
        await pool.query(command, [req.params.item_id], (error, result) => {
            if (error) return console.log("Bad request to db")
            res.render('edit_item', {item: result.rows[0]})
        })
    }

    async delete(req, res) {
        let command = "DELETE FROM items WHERE item_id = $1"
        await pool.query(command, [req.params.item_id], (error, result) => {
            if (error) return res.render('error', {props: "Bad request to db"})
        })
        res.redirect('/profile')
    }

    async filter(req, res){
        if (!req.body) return res.sendStatus(400)
        let command = "SELECT * FROM items WHERE"
        if (req.body.price_from !== "") command += " price>=" + req.body.price_from
        if (req.body.price_to !== "") {
            if (command.slice(-1) === 'E') command += " price<=" + req.body.price_to
            else command += " AND price<=" + req.body.price_to
        }
        if (req.body.size_from !== "") {
            if (command.slice(-1) === 'E') command += " size>=" + req.body.size_from
            else command += " AND size>=" + req.body.size_from
        }
        if (req.body.size_to !== "") {
            if (command.slice(-1) === 'E') command += " size<=" + req.body.size_to
            else command += " AND size<=" + req.body.size_to
        }
        if (req.body.city !== "") {
            if (command.slice(-1) === 'E') command += " city='" + req.body.city + "'"
            else command += " AND city='" + req.body.city + "'"
        }
        if (command === "SELECT * FROM items WHERE") return res.render('error', {props: "No filter data"})
        await pool.query(command, async (error, result) => {
            if (error) return res.render('error', {props: "Bad request to db"})
            await pool.query("SELECT city FROM items", (err, result1) => {
                if (err) return res.sendStatus(400)
                res.render('main', {items: result.rows, cities: result1.rows})
            })
        })
    }

    async sort(req, res) {
        if (!req.body) return res.sendStatus(400)
        await pool.query("SELECT city FROM items", async (err, result1) => {
            if (err) return res.sendStatus(400)
            switch (req.body.sortType) {
                case "Price max->min":
                    let command1 = "SELECT * FROM ITEMS ORDER BY price DESC"
                    await pool.query(command1, (error, result) => {
                        if (error) return res.render('error', {props: "Bad request to db"})
                        res.render('main', {items: result.rows, cities: result1.rows})
                    })
                    break
                case "Price min->max":
                    let command2 = "SELECT * FROM ITEMS ORDER BY price"
                    await pool.query(command2, (error, result) => {
                        if (error) return res.render('error', {props: "Bad request to db"})
                        res.render('main', {items: result.rows, cities: result1.rows})
                    })
                    break
                case "Size max->min":
                    let command3 = "SELECT * FROM ITEMS ORDER BY size DESC"
                    await pool.query(command3, (error, result) => {
                        if (error) return res.render('error', {props: "Bad request to db"})
                        res.render('main', {items: result.rows, cities: result1.rows})
                    })
                    break
                case "Size min->max":
                    let command4 = "SELECT * FROM ITEMS ORDER BY size"
                    await pool.query(command4, (error, result) => {
                        if (error) return res.render('error', {props: "Bad request to db"})
                        res.render('main', {items: result.rows, cities: result1.rows})
                    })
                    break
                case "Owner":
                    let command5 = "SELECT * FROM ITEMS ORDER BY owner_id"
                    await pool.query(command5, (error, result) => {
                        if (error) return res.render('error', {props: "Bad request to db"})
                        res.render('main', {items: result.rows, cities: result1.rows})
                    })
                    break
                case 'City':
                    let command6 = "SELECT * FROM ITEMS ORDER BY city"
                    await pool.query(command6, (error, result) => {
                        if (error) return res.render('error', {props: "Bad request to db"})
                        res.render('main', {items: result.rows, cities: result1.rows})
                    })
                    break
                default:
                    res.render('error', {props: "No sort data"})
            }
        })
    }
}

module.exports = ItemsController