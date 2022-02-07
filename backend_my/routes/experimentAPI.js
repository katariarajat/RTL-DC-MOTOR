var express = require("express");
var router = express.Router();


// Load Experiment model
const User = require("../models/Experiments");

router.get("/", function(req, res) {
	res.send("API tested!");
});

module.exports = router;
