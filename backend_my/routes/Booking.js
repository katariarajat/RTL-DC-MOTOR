var express = require("express");
var router = express.Router();

// Load User model
const User = require("../models/Users");
const Session = require("../models/Sessions");

router.put("/add", (req,res) => {
    console.log(req.body)
    
    Session.findOne({ date : req.body.date }).then(day => {
		// Check if user email exists
		if (!day) {
            const newUser = new Session({
                date : req.body.date,
                slots : []
            });
            newUser.save();
        }
        
	});



    Session.findOneAndUpdate(
        {
            date : req.body.date,
            "slots.slot": {$ne : req.body.endtime},
        },
        {
            $push :{ slots : {
                slot : req.body.endtime,
            }},
        },
        {
            new: true
        },
        function(err,slot) {
            console.log("slot " ,slot);
            if(slot == null)
            {
                res.send({
                    success : 'false',
                    res : 'Slot already booked',
                });
            }
            else 
            {
                // console.log(req.body);
                var session = {
                    sessionDate : req.body.date,
                    sessionStartTime : req.body.starttime,
                    sessionEndTime : req.body.endtime,
                    experiment : [],
                }
                // console.log(session);
                User.findOneAndUpdate(
                    {
                        email : req.body.email,
                    },
                    {
                        $push: { sessions : session},
                    },
                    function(err,user){
                        // console.log(err)
                        if(err)
                        {
                            
                            res.send({
                                success: false,
                                message: "user not found",
                            })
                        }
                        else 
                        {
                            console.log(user);
                            res.send({
                                success : "true",
                                message: "Session reserved successfully" ,
                            });
                        }
                    }
                );
                
            }
        });
});


module.exports = router;