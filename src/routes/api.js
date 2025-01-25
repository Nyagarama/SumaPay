const express = require("express");
const router = express.Router();
const fundController = require('../controllers')
const userAcount = require("../models")

//api defined enpoints
router.get("/users", userAcount.createAccount)// create a new account