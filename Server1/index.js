const express = require('express');
const app = express();
const jsonwebtoken = require('jsonwebtoken');
var { expressjwt: jwt } = require("express-jwt");
const bodyParsers = require('body-parser');
const axios = require("axios")
////////////////////////////// ZIPKIN //////////////////////////////////


const { Tracer } = require('zipkin');
const { BatchRecorder } = require('zipkin');
const { HttpLogger } = require('zipkin-transport-http');
const CLSContext = require('zipkin-context-cls');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;

const ctxImpl = new CLSContext();

const recorder = new BatchRecorder({
    logger: new HttpLogger({
        endpoint: `http://localhost:9411/api/v1/spans`
    })
});

const tracer = new Tracer({ ctxImpl, recorder });


app.use(zipkinMiddleware({
    tracer,
    serviceName: 'service_1' // name of this application
}));


////////////////////////////////////////////////////////////////////////


// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParsers.urlencoded({
    limit: '2000mb',
    extended: true,
});
app.use(urlencodedParser);

// parse application/json
var jsonParser = bodyParsers.json({ limit: '2000mb' });
app.use(jsonParser);

app.get("/user", ((req, res, next) => {
    let { name } = req.query;

    // Define your payload (data to be included in the token)
    const payload = {
        name: name
    };
    // Define a secret key (should be a secure, long, and random string)
    const secretKey = 'your_secret_key';
    // Generate the JWT token
    const token = jsonwebtoken.sign(payload, secretKey);

    res.status(200).json(token);
}))

// jwt({ secret: "your_secret_key", algorithms: ["HS256"] })

app.post("/protected", ((req, res, next) => {

    console.log(req.header('user_name'), "user_name from header");
    console.log(req.header('user_iat'), "user_iat from header");

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


app.use((err, req, res, next) => {
    console.log("Inside error handler");
    res.sendStatus(401);
})

app.listen(4000, (() => {
    console.log("Application is running on port 4000");
}))