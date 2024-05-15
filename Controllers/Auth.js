const bcrypt = require("bcrypt");

// To interact with DB
const User = require("../models/User");
const { response } = require("express");
const jwt = require("jsonwebtoken");

require("dotenv").config();
//=================== Signup route Handler===================

exports.signup = async(req, res)=>{
    try{
        // get the data
        const {name, email,password, role} = req.body;
        // check if user already exist 
        const  existingUser = await User.findOne({email});
        
        // IF THERE IS AN EXISTING USER WITH THIS ID THEN RETURN THE RESPONSE
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already Exists',
            })
        }

        // ==============SECURE PASSWORD==================

                let hashedPassword;
                try{
                    hashedPassword = await bcrypt.hash(password, 10);
                }
                catch(err){
                    return res.status(500).json({
                        success:false,
                        message:'Error in hashing  password'
                    })
                }

                // create entry for User (created an entry in the Database)
            const user = await User.create({
                name, email, password:hashedPassword, role
            })
            return res.status(200).json({
                success:true,
                messsage:'User Created Successfully',
                name:name,
                role: role
            })
    }
    catch(error){
            console.error(error);
            return res.status(500).json({
                success:false,
                message:"User Can not be registered, please try again later"
            })
    }
}


// ==================Login Route handler====================

exports.login = async(req, res) =>{
    try{
            // Fetch Data
            var {email, password} = req.body;
            // Validation on email and password
            if(!email || !password){
                return res.status(400).json({
                    success:false,
                    message:'Please fill all the details'
                });
            }

            //check for user is (Registered) available or not
            const user = await User.findOne({email});

            //if user is not registered
            if(!user){
                return res.status(401).json({
                    success:false,
                    message:"User is not Registered",
                })
            }
                // The exact data You want to use in the JWT token
            const  payload = {
                email: user.email,
                id:user._id,
                role:user.role,

            }
            //=`=`=`=` VERIFY PASSWORD AND GENERATE JWT TOKEN =`=`=`=`=
            if(await bcrypt.compare(password, user.password)){
                    // password match
                                        // first parameter PAYLOAD, second parameter JWT Secret Key
                    let token = jwt.sign(payload, 
                                        process.env.JWT_SECRET,
                                        {
                                            expiresIn:"2h",
                                        });
                    // adding token in the object of user
                  
                    user.token = token;
                    // remove the password from the object of USER
                    user.password = undefined;

                    const options = {
                            expiresIn: new Date(Date.now() + 3*24* 60*60 *1000),
                            httpOnly:true,
                    }
                    // SENDING COOKIE IN RESPONSE
                    res.cookie("token", token, options).status(200).json({
                        success:true,
                        token,
                        user,
                        message:'User Logged in successfully'
                    })
            }
            else{
                // passowrds do not match
                return res.status(403).json({
                    success:false,
                    message:"password Incorrect",
                })
            }
    }
    catch(error){
        console.log(error)
    }
}