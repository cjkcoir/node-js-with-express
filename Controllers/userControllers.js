const User = require("./../Models/usersModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const sendEmail = require("./../Utils/email");
const crypto = require("crypto");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      status: "success",
      NoOfUsers: users.length,
      data: {
        users: users,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while getting ALL USERS",
      error: err.message,
    });
  }
};

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

const filterReqObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

exports.updatePassword = async (req, res, next) => {
  //Get current user data from db
  const user = await User.findById(req.user._id).select("+password");
  //Check if the supplied current password is correct
  if (
    !(await user.comparePasswordInDb(req.body.currentPassword, user.password))
  ) {
    res.status(401).json({
      status: "Fail",
      message: "The current password you provides is wrong",
    });
  }
  //if supplied password is correct, update the password with the value
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  //Login user & send JWT

  createSendResponse(user, 200, res);
  // const loginToken = signInToken(user._id);

  // res.status(200).json({
  //   status: "Login Success",
  //   message: "Loggedin",
  //   loginToken: loginToken,
  //   loginUser: user,
  // });
};

// exports.updateMe = async (req, res, next) => {
//   if (req.body.password || req.body.confirmPassword) {
//     res.status(400).json({
//       status: "Fail",
//       message: "You can't update your Password using this endpoint",
//     });
//   }

//   //Update the User Details
//   const filterObject = filterReqObj(req.body, "name", "email");
//   const updatedUser = await User.findByIdAndUpdate(req.user._id, filterObject, {
//     runValidators: true,
//     new: true,
//   });
//   //   await user.save();
// };

// exports.updateMe = async (req, res, next) => {
//   try {
//     // 1. Block password updates on this route
//     if (req.body.password || req.body.confirmPassword) {
//       return res.status(400).json({
//         status: "fail",
//         message:
//           "You can't update your password using this endpoint. Please use /updatePassword instead.",
//       });
//     }

//     // 2. Filter the request body (only allow name and email updates)
//     const filterObject = filterReqObj(req.body, "name", "email");

//     // 3. Update user document
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       filterObject,
//       {
//         new: true, // return the updated doc
//         runValidators: true, // enforce schema validators
//         context: "query",
//       }
//     );

//     // 4. Send response
//     res.status(200).json({
//       status: "success",
//       data: {
//         user: updatedUser,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong while updating user",
//       error: err.message,
//     });
//   }
// };

// exports.updateMe = async (req, res, next) => {
//   try {
//     // 1. Block password updates on this route
//     if (req.body.password || req.body.confirmPassword) {
//       return res.status(400).json({
//         status: "fail",
//         message:
//           "You can't update your password using this endpoint. Please use /updatePassword instead.",
//       });
//     }

//     // This section was updated to be more robust
//     // 2. Find the user document
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({
//         status: "fail",
//         message: "User not found.",
//       });
//     }

//     // 3. Update the allowed fields and save
//     if (req.body.name) user.name = req.body.name;
//     if (req.body.email) user.email = req.body.email;

//     await user.save({ validateBeforeSave: true });

//     // 4. Send response
//     res.status(200).json({
//       status: "success",
//       data: {
//         user: user,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong while updating user",
//       error: err.message,
//     });
//   }
// };

exports.updateMe = async (req, res, next) => {
  try {
    // 1. Block password updates on this route
    if (req.body.password || req.body.confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message:
          "You can't update your password using this endpoint. Please use /updatePassword instead.",
      });
    }

    // 2. Filter the request body to allow only name and email
    const filterObject = filterReqObj(req.body, "name", "email");

    // 3. Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filterObject,
      {
        new: true, // Return the updated document
        runValidators: true, // Enforce schema validators
        context: "query", // A key option to make sure validators run correctly for findByIdAndUpdate
      }
    );

    // 4. Send response
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while updating user",
      error: err.message,
    });
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    return res.status(200).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while updating user",
      error: err.message,
    });
  }
};
