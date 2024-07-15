const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
async function registerUser(req, res) {
  try {
    const { name, email, password, profile_pic } = req.body;

    const checkEmail = await UserModel.findOne({ email }); //{name,Email} // null
    if (checkEmail) {
      return res.status(400).json({
        message: "Already user exists",
        error: true,
      });
    }

    //password into hashpassword
    const salt = await bcryptjs.genSalt(10);
    const hashpassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      profile_pic,
      password: hashpassword,
    };

    const user = new UserModel(payload);
    const userSave = await user.save();

    return res.status(201).json({
      message: "User created successfully",
      data: userSave,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

async function checkEmail(req, res) {
  try {
    const { email } = req.body;
    const checkEmail = await UserModel.findOne({ email }).select("-password"); // -password: select all of UserModel but not select password

    if (!checkEmail) {
      return res.status(400).json({
        message: "User not exists",
        error: true,
      });
    }
    return res.status(200).json({
      message: "email verify",
      success: true,
      data: checkEmail,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
async function checkPassword(req, res) {
  try {
    const { userID, password } = req.body;
    const user = await UserModel.findById(userID);
    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({
        message: "Please check password",
        error: true,
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRECT_KEY, {
      expiresIn: "1d",
    });
    const cookieOption = {
      http: true,
      secure: true,
    };
    return res.cookie("token", token, cookieOption).status(200).json({
      message: "Login Successfully",
      success: true,
      token: token,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

async function userDetails(req, res) {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsFromToken(token);
    return res.status(200).json({
      message: "user details",
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

async function updateUserDetails(req, res) {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsFromToken(token);
    const { name, profile_pic } = req.body;
    const updateUser = await UserModel.updateOne(
      { _id: user._id },
      { name, profile_pic }
    );

    const userInformation = await UserModel.findById(user._id).select(
      "-password"
    );

    return res.status(200).json({
      message: "Updated Successfully",
      success: true,
      data: userInformation,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

async function searchUser(req, res) {
  try {
    const { search } = req.body;
    const query = new RegExp(search, "i"); //i: bỏ qua chữ hoa chữ thường, g: tìm tất cả matches trong chuỗi, không chỉ đầu tiên

    const user = await UserModel.find({
      $or: [{ name: query }, { email: query }],
    }).select("-password");

    return res.json({
      message: "all user",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
module.exports = {
  registerUser,
  checkEmail,
  checkPassword,
  userDetails,
  updateUserDetails,
  searchUser,
};
