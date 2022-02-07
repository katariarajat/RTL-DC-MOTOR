var express = require("express");
var router = express.Router();

// Load User model
const User = require("../models/Users");
const Session = require("../models/Sessions");
const Userexperiment = require("../models/UserExperiment");
const Usersessions = require("../models/UserSessions");
const UserSessions = require("../models/UserSessions");
const UserExperiment = require("../models/UserExperiment");
// const { checkedLogged } = require("../../Frontend/src/Sources/Auth");

router.post("/addsession", async (req,res) => {
        var username = req.body.userEmail;
        console.log(req.body);
        console.log(username);
        var StartTime = req.body.starttime.substring(0,2) + "00";
        var EndTime = req.body.starttime.substring(0,2)  + "59";
        var response = {
            success : false,
            res : "",
        }
        // var session = await Session.findOne({
        //     date : req.body.date,
        // });
        // console.log(session);
        // if(!session)
        // {
        //     const newsession = new Session({
        //         date : req.body.date,
        //         slots : [],
        //     }); 
        //     session = await newsession.save();
        //     console.log("IN IF");
        //     console.log(session);
        // }
        // console
        // var sessionSlots = session.slots.toObject();
        // for (let index = 0; index < sessionSlots.length; index++) {
        //     const element = sessionSlots[index];
        //     if(element == StartTime)
        //     {
        //         response.success = true;
        //         response.res = "Session Already Booked";
        //         return res.json(response);
        //     }
        // }
        // await session.slots.push(StartTime);
        // await session.save();
        // console.log(session);
        // await session.slots.pull(StartTime);
        // await session.save();
        // console.log(session);
        // var user = await User.findOne({email : username});
        
        Session.findOneAndUpdate(
            {
                date : req.body.date,
            },
            {
                date : req.body.date,
            },
            {
                new : true,
                rawResult : true,
                upsert : true,
            },
            function(err,sess)
            {
                Session.findOneAndUpdate({
                        date : req.body.date,
                        slots : {$ne : StartTime},
                    },{
                        $push : { slots : StartTime,},
                    },{
                        new: true,
                        rawResult:true,
                    },async function(err,slot) {
                        if(slot.lastErrorObject.updatedExisting)
                        {
                            const newSession = new Usersessions({
                                email: username,
                                sessionDate : req.body.date,
                                sessionStartTime : StartTime,
                                sessionEndTime : EndTime,
                                experiment : [],
                            });
                            await newSession.save(async function(err,session){
                                console.log(session);
                                User.findOneAndUpdate({
                                        email : username,
                                    },{
                                        $push: { sessions : session.id},
                                    },function(err,user){
                                            console.log(user);
                                            res.json({ success : true, res: "Session reserved successfully" , });
                                    }
                                );
                            });            
                        }
                        else {
                            res.json({ success : false, res : 'Slot already booked', });
                        }
                    });
            }
        )
});

function createHour(index)
{
    if(index >= 10){
        ind = String(index);
    }
    else {
        ind =  '0' + String(index);
    }
    return ind;
}


router.get("/getslot",(req,res)=>{
        var filter = {date : req.query.date};
        var todayTime = new Date().getHours();
        Session.findOne(filter,
         function (err,docs) {
            myArray = []    
            for (let index = 1; index < 24; index++) {
                var element = createHour(index);
                if(createHour(index) >= todayTime)
                {
                    myArray.push(createHour(index) + '00');
                }
            }
            if(docs)
            {
                item = docs.slots.toObject();
                
                myArray = myArray.filter(function (b) {
                    return item.indexOf(b) === -1;
                });
            }              
            
            for (let index = 0; index < myArray.length; index++) {
                const element = myArray[index];
                myArray[index] = element.substring(0,2) + ':' + "00";
            }  
            res.json({
                success : true,
                res : "Slots send",
                slots : myArray, // list
            });
        }); 
});

router.post("/createxperiment",async (req,res)=>{
        console.log(req.body);
        var username = req.body.email;
        console.log(username);
        var datetime = new Date().toLocaleString("en-GB", {timeZone: "Asia/Kolkata"});
        var dateFormat = datetime.substring(6,10)+ '-' + datetime.substring(3,5) + '-' + datetime.substring(0,2);
        var Curr_Time = datetime.substring(12,14);
        console.log(dateFormat);
        console.log(Curr_Time);
        var Session_list = await Usersessions.find({
            email : username,
            sessionDate : dateFormat,   
            sessionStartTime : { '$regex': '^'+ Curr_Time, '$options': 'i' },
        });
        console.log(Session_list); // 
        if(Session_list.length != 0)
        {
            const newExp = new Userexperiment({
                experimentData: [],
                description : '',
                isactive : false,
            });
            newExp.save(function(err,exp){
                Usersessions.findOneAndUpdate(
                    {email : username,
                    sessionDate : dateFormat,   
                    sessionStartTime : { '$regex': '^'+Curr_Time, '$options': 'i' }},
                    {
                        $push : {
                            experiments : exp.id,
                        },
                    },{
                        new : true,
                    },
                    function(err,sess)
                    {
                        if(sess){
                            res.json({success : true, res : exp.id, });
                        }
                    }
                );
            });
        }
        else 
        {
            res.json({success: false, res: "This session is not booked by you.",});
        }
});


// function GetUsername(req){
//     // const username = GetUsername(req)
//     const base64Credentials = req.headers.authorization.split(' ')[1];
//     const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
//     const [username,password] = credentials.split(':');
//     return username;
// }

router.post("/experimentdata",async (req,res)=>{
    const data = await Userexperiment.findOne({ _id : req.body.experiment_id});
    if(data){
        console.log("sending data == ", data);
        res.json({success : true,data : data,});
    }
    else {
        res.json({success : false, res : "no experiment found with this id",});
    }
});

router.post("/getExperiment",async (req,res) => {
    username = req.body.userEmail;
    var datetime = new Date().toLocaleString("en-GB", {timeZone: "Asia/Kolkata"});
    var Curr_Time = datetime.substring(12,14);
    console.log(req.body)
    let user = await UserSessions.findOne({
        email : username,
        _id : req.body.session_id,   
        // sessionStartTime : { '$regex': '^' + Curr_Time, '$options': 'i' },

    });
    console.log(user);


    let result_experiments = [];
    let list = user.experiments.toObject(); 
    for (sess in list)
    {
        result_experiments.push({
            ExperimentId : list[sess]
        });
    }
    console.log(result_experiments);
    res.json({success : true, res : "success", experiments : result_experiments, });
});

router.get("/getsession",async (req,res) => {
    username = req.query.userEmail;
    // console.log(req.query);
    // GetUsername(req)
    let user = await User.findOne({email : username});
    let result_session = [];
    let list = user.sessions.toObject(); 
    for (sess in list)
    {
        console.log(list[sess]);
        let temp = await Usersessions.findOne({_id : list[sess]},{sessionDate : true, sessionStartTime: true});
        result_session.push({
            sessionStartTime : temp.sessionStartTime.substring(0,2) + ':' + temp.sessionStartTime.substring(2,5),
            sessionDate : temp.sessionDate,
            sessionId : list[sess],
        });
    }
    console.log(result_session);
    res.json({ success : true, res : "success", sessions : result_session, });
});

router.post("/deleteSession",async(req,res) => {

    username = req.body.userEmail;
    const sessi = await UserSessions.findById(req.body.session_id);
    console.log(sessi);
    let item = sessi.experiments.toObject();

    for(i in item){
        console.log(item[i]); 
        const k = await UserExperiment.findById(item[i]);
        k.remove();
    }
    const slot = await Session.findOne({date : sessi.sessionDate});
    var idxx = slot.slots.indexOf(sessi.starttime);
    if(idx !== -1)
    {
        slot.slots.splice(idxx, 1);
        slot.save(function(err,ress) {
            console.log(ress);
        });
    }
    const user = await User.findOne({email : username});
    var idx = user.sessions.indexOf(req.body.session_id);
    if(idx !== -1)
    {
        user.sessions.splice(idx, 1);
        user.save(function(err,ress) {
            console.log(ress);
        });
    }
    const ses = await UserSessions.findById(req.body.session_id);
    ses.remove();

    res.json({ success : true, res : "Session Deleted"});
});


router.post("/deleteExperiment", async(req,res) => {
    let exp = await UserExperiment.findById(req.body.experiment_id);
    console.log(exp);
    let sess = await Usersessions.findById(req.body.session_id);
    console.log(sess);
    var idx = sess.experiments.indexOf(req.body.experiment_id);
    if(idx !== -1)
    {
        sess.experiments.splice(idx, 1);
        sess.save(function(err,ress) {
            console.log(ress);
        });
    }
    exp.remove();
    res.json({ success : true, res : "Experiment Deleted"});
});

router.post("/saveExperiment",async(req,res) => {
    var expId = req.body.expId;
    var expTime = req.body.LastSavedtime;
    var graphData = req.body.graphData;
    var description = req.body.description;
    let exp = await UserExperiment.findById(expId);
    console.log(exp);
    exp.time = expTime;
    exp.experimentData = graphData;
    exp.description = description;
    await exp.save().then((exp,err) => {
        if(err)
        {
            res.json({success : false, data : "Data saved Successfully "});
        }
        else 
        {
            res.json({success : true, res : " Data saved successfully"});
        }
    });
});


module.exports = router;

