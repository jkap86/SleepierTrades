module.exports = (app) => {
    const rateLimit = require('express-rate-limit');
    const users = require("../controllers/user.controller.js");
    var router = require("express").Router();

    const limiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 10, // Limit each IP to 5 requests per minute
    });


    router.get("/create", limiter, (req, res) => {
        users.create(req, res, app)
    })

    router.get("/lmplayershares", users.lmplayershares);

    router.get("/findmostleagues", limiter, (req, res) => {
        const users = app.get('top_users')
        res.send(users || [])
    })

    app.use('/user', router);
}