const express = require("express");
const router = express.Router();
const fundController = require('../controllers/loanController')
const userAcount = require("../models/User")
const auth = require('../routes/auth');
 
//api defined enpoints
 
// endpoint for user account
// router.get("/users", userAcount.createAccount)// create a new account
// router.get("/users", userAcount.getAllUsers)// get all users
// router.get("/users/:id", userAcount.getUserById)// get a single user by id
// router.put("/users/:id", userAcount.updateUser)// update a user by id
// router.delete("/users/:id", userAcount.deleteUser)// delete a user by id
 
// endpoint for fund contribution
// router.get("/contribution", fundController.createFund)// create a new fund
// router.get("/contribution", fundController.getAllFunds)// get all funds
// router.get("/contribution/:id", fundController.getFundById)// get a single fund by id
// router.put("/contribution/:id", fundController.updateFund)// update a fund by id
 
// endpoint for group
// router.get("/group", fundController.createGroup)// create a new grou
// router.get("/group", fundController.getAllGroups)// get all groups
// router.get("/group/:id", fundController.getGroupById)// get a single group by id
// router.put("/group/:id", fundController.updateGroup)// update a group by id
 
//set up sign up route
router.post('/signup', auth.signup);
 
//set up login route
router.post('/login', auth.login);
 
//set up logout route
router.get('/logout', auth.logout);
 
module.exports = router;
 