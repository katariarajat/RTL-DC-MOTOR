const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const DB_NAME = "dcmotorDB";
const dotenv = require('dotenv');

// routes
var experimentAPIRouter = require("./routes/experimentAPI");
var UserRouter = require("./routes/Users");
var BookingRouter = require("./routes/Booking");

app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

dotenv.config();

// Connection to MongoDB
try{
    mongoose.connect(`${process.env.API_URL}`, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
});
}
catch (error){
    console.error(`Error: ${error.message}`)
    process.exit(1)
}


// setup API endpoints

app.use("/experiment", experimentAPIRouter);
app.use("/user", UserRouter);
app.use("/booking",BookingRouter);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
