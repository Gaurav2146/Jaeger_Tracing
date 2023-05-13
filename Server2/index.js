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
    serviceName: 'service_2' // name of this application
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


app.use((err, req, res, next) => {
    if (err) {
        console.log(err);
        console.log("Inside error handler");
        res.sendStatus(500);
    }
})

app.listen(5000, (() => {
    console.log("Application is running on port 5000");
}))