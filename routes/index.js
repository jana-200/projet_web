const express = require('express');
const router = express.Router();


const Tournament = require("../models/Tournament.js");
const Court = require("../models/Court.js");
const Message = require("../models/Message.js");



router.get('/', (req, res) => {
    const numberOfTournaments = Tournament.getUpcomingTournaments();
    const numberOfCourts = Court.getUpcomingBookings();
    const numberOfMessages = Message.getNumberOfMessages();
    console.log(numberOfTournaments);
    console.log(numberOfCourts);
    res.render('index.hbs',{numberOfTournaments, numberOfCourts, numberOfMessages});
});

module.exports = router;