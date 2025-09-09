const User = require("./../Models/usersModel");

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
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
