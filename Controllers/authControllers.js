const User = require("./../Models/usersModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const sendEmail = require("./../Utils/email");
const crypto = require("crypto");

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STRING, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendResponse = (user, statusCode, res) => {
  const loginToken = signInToken(user._id);

  res.status(statusCode).json({
    status: "Login Success",
    message: "Loggedin",
    loginToken: loginToken,
    loginUser: user,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    // const token = jwt.sign({ id: newUser._id }, process.env.SECRET_STRING, {
    //   expiresIn: process.env.JWT_EXPIRES_IN,
    // });

    const token = signInToken(newUser._id);
    res.status(200).json({
      status: "Success",

      data: {
        createdUser: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      res.status(400).json({
        status: "Fail",
        message: "Please provide Email & Password for Login",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    // const isMatch = await user.comparePasswordInDb(password, user.password);
    if (!user || !(await user.comparePasswordInDb(password, user.password))) {
      res.status(400).json({
        status: "Fail",
        message: "Incorrect Email & Password for Login",
      });
    }

    createSendResponse(user, 201, res);
    // const token = signInToken(user._id);

    // res.status(200).json({
    //   status: "Login Success",
    //   message: "Loggedin",
    //   token: token,
    //   user: user,
    // });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    //1.Read the token & check if it exists
    const testToken = req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith("Bearer")) {
      token = testToken.split(" ")[1];
      console.log(token);
    }
    if (!token) {
      return res.status(401).json({
        status: "Fail",
        message: "You are not LoggedIn",
      });
    }

    // validating the token
    const decodedToken = await util.promisify(jwt.verify)(
      token,
      process.env.SECRET_STRING
    );
    console.log("decodedToken =", decodedToken);

    //If the user exists in database

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({
        status: "Fail",
        message: "The user with the given token does not exists in the DB",
      });
    }

    // ✅ Attach user to request
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "Fail",
        message: "Your token has expired. Please log in again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "Fail",
        message: "Invalid token. Please log in again.",
      });
    }

    return res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};

exports.restrict = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      res.status(403).json({
        status: "Fail",
        message: "You dont have the permission to DELETE a Movie",
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  //1.Get the User based on Posted Email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404).json({
      status: "Fail",
      message: "We could not find the user with the given email",
    });
  }
  //2.Generate A Random Reset Token.

  const resetToken = user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //3.Send the Email to the User email & send reset Token

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `We have receieved a password reset request.Please use the below link to reset your Password. \n\n\n ${resetUrl} \n\n. This reset Password link is valid for only 10 Minutes `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password change Request receieved",
      message: message,
    });

    res.status(200).json({
      status: "Success",
      message: "Password reset Linke send to the User Email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({ validateBeforeSave: false });

    res.status(500).json({
      status: "Fail",
      message:
        "There was an error sending password reset email: Please Try Again Later",
    });
  }
};
// exports.resetPassword = async (req, res, next) => {
//   //IF THE USER EXISTS WITH THE GIVEN TOKEN & TOKEN HAS NOT EXPIRED

//   const token = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");
//   const user = await User.findOne({
//     passwordResetToken: token,
//     passwordResetTokenExpires: { $gt: Date.now() },
//   });

//   if (!user) {
//     res.status(400).json({
//       status: "Fail",
//       message: "Password reset Token has INVALID or has Expired",
//     });
//   }

//   //RESETTING THE USER PASSWORD
//   user.password = req.body.password;
//   user.confirmPassword = req.body.confirmPassword;
//   user.passwordResetToken = undefined;
//   user.passwordResetTokenExpires = undefined;
//   user.passwordChangedAt = Date.now();

//   user.save();

//   //AFTER RESETTING LOGIN AUTOMATICALLY
//   createSendResponse(user, 201, res);
// };

exports.resetPassword = async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "Fail",
      message: "Password reset Token is INVALID or has EXPIRED",
    });
  }

  // Resetting the user password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  // After resetting, login automatically
  createSendResponse(user, 201, res);
};
