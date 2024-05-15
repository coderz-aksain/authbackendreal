const express = require("express");
const app = express();


require('dotenv').config();
const PORT = process.env.PORT || 4000;

// COOKIE-PARSER WHAT IS THIS AND WHY WE NEED THIS ?
const cookieParser = require("cookie-parser");
// middleware
app.use(cookieParser());
app.use(express.json());

require("./config/database").connect();

     
// ṛoute import and mount
const  user = require("./routes/user");
app.use("/api/v1", user);


// activate the server
app.listen(PORT, ()=>{
    console.log(`App is listening at ${PORT}`);
})