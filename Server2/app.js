
const { init } = require('./tracer')
init('demo-node-service2', 'development')

const express = require('express')
const axios = require('axios')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post("/test", ((req, res, next) => {
    try {
        let { name, description, cost, categoryId } = req.body;
        return res.status(200).json({
            name: name,
            description: description,
            cost: cost,
            categoryId: categoryId
        });
    } catch (error) {
        res.sendStatus(500);
    }
}))

app.listen(5000, (req, res) => {
    console.log('server started on port 5000')
})
