
const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    })
    .then(()=> {console.log("DB Connected  successfully")})
    .catch((err)=>{
        console.log("Db connection Issues")
        console.error(err);
        process.exit(1); // something wrong happened that is why we are exiting
    })
}
