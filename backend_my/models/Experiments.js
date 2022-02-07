const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ExperimentSchema = new Schema(
  {
    experimentData: [
      {
        request: {
          voltage: {
            type: Number,
            required: true,
          },
        },
        response: {
          theoreticalRPM: {
            type: Number,
            default: null,
          },
          calculatedRPM: {
            type: Number,
            default: null,
          },
          powerConsumed: {
            type: Number,
            default: null,
          },
          latency: {
            type: Date,
            default: null,
          },
        },
  
      }
    ]
    
    
  },
  {
    timestamp : true,
  }
  
);

module.exports = Experiment = mongoose.model("Experiments", ExperimentSchema);

// MONGOID:  Timestamp : HHMMSSDDMMYYYY  INPUT:  OUTPUT:  POWER:  VOLTAGE:  CURRENT:

/*

TIMESTAMP
    INPUTTime:
    Backendreceive:
    ESPRECEIVE:
    BACKENDOUTPUT RECEIVE:
    FRONTENDOUTPUT RECEIVE:

    on/off 
    votage

    X V ON 15sec request -----> OFF
    Next request time

    COOLOFPERIOD

     Experiment : [
        {input output pC}

     ]

    experiment:
    {
        Experiment_instance:{
            id:
            input:
            output:
        }
    }
    */

/*
        hhttmm 150 ON 5 min off 
        experiment {
            id : time
            input:
            ouput:
        }



        SCHEDULING 

    
    */

/*
Multiple Users
    - Multiple Sessions
        - Multiple Experiments
            - Single Graph for Multiple I/O instances
*/

/*
User will have list of list session[experiments] - 2D array
Experiment - Graph can be represented as I/O format.
*/

/*
    Database -> Collection -> Documents{schema for each document}
    Users(collections) session:[Sid1,Sid2,Sid3,Sid4]
    Collection sessions -> id {
        Experiment(list[Eid1,Eid2,,,])
    } 
    Collection experiment - > id DATA{input avg output }

    Rajat -> 

    Session -> timing (3-4)
    experiment1 -> (150v 5min )
    experiment2 -> (150v 5min )
    
    aysuh-> 
    Seesion -> timing 
    Experiment ->
    {
        experiment1-> 
        experiment2-> 
    }
    
    GRAPHS -> rpm vs time
    voltage vs time 
    voltage vs rpm 
    



*/
