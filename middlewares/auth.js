// Auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();
// ========================AUTHENTICATION MIDDLEWARE=====================
exports.auth = (req, res, next) => {
  try {

    // extract JWT tocken  OR other ways to fetch token
    console.log("cookie", req.cookies.token);
    console.log("body", req.body.token);
    //  console.log("header",req.header("Authorization"));
    const token = req.cookie.token || req.body.token || req.header("Authorization").replace("Bearer ", " ");

    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is Absent",
      });
    }

    // VERIFY THE TOKEN
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      // why this ? we have stored the payload in the req.user
      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong, while verifying the token",
    });
  }
};

// ========================STUDENT MIDDLEWARE=====================

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for  students",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "User role is not matching",
    });
  }
};

// ========================ADMIN MIDDLEWARE=====================

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User Role is not matching",
    });
  }
};
