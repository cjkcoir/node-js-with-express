const User = require("./../Models/usersModel");
const jwt = require("jsonwebtoken");

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STRING, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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

    const token = signInToken(user._id);

    res.status(200).json({
      status: "Login Success",
      message: "Loggedin",
      token: token,
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};
