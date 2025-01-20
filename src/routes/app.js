import express from 'express';
const routes = express.Router();
const fundController = require("../controllers/funds")

//end points/ routes/ api/ admin
routes.get("/admin", )
//end points/ routes/ api/login routes
routes.post("/signin, fundController.signin")

//end points/ routes/ api/logout routes
routes.post("/logout, fundController.logout")


module.exports = routes;