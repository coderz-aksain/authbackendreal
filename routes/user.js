const express  = require("express");
const router = express.Router();

const {login, signup}= require("../Controllers/Auth")
const {auth, isStudent, isAdmin} = require("../middlewares/auth");
router.post("/login", login);
router.post("/signup", signup);

// PROTECTED ROUTES
        // Testing protected route for single middlewares
router.get("/test", auth, (req, res)=>{
    res.json({
        success:true,
        message:'Welcome to the protected route for testing'
    })
});
            // path,    middlewares,   habdler, action that is to be performed
router.get("/student", auth, isStudent, (req, res)=>{
    res.json({
        success:true,
        message:'Welcome to the protected routes for the student'
    })
});
router.get("/admin", auth, isAdmin, (req, res)=>{
    res.json({
        success:true,
        message:'Welcome to the protected routes for the Admin'
    })
});
module.exports = router;