
const { init } = require('./tracer')
init('demo-node-service1', 'development')

const express = require('express')
const axios = require('axios')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post("/protected", ((req, res, next) => {
    axios.post('http://localhost:5000/test', {
        name: 'Apple Iphone 11',
        description: 'Previous generation mobile from Apple',
        cost: 50000,
        categoryId: 5
    })
        .then(function (response) {
            res.status(200).json(response.data);
        })
        .catch(function (error) {
            console.log(error);
            res.sendStatus(500);
        });
}))

app.listen(4000, (req, res) => {
    console.log('server started on port 4000')
})
