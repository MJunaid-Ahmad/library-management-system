import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import sessionModel from "../model/sessionModel.js";
import userModel from "../model/userModel.js";
dotenv.config();
const regex =
  /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]{2,16}).([a-z]{2,8})(.[a-z]{2,8})?$/;


async function registerUser(req, res, next) {
  try {
    let { name, email, password, role } = req.body;

    if (typeof name === "string") {
      if ( name.trim().length < 3)
        return res.status(400).json({
          success: false,
          message: "Name must be at least 3 characters long..",
        });
    } else {
      return res.status(400).json({
        success: false,
        message: "Name must be string.",
      });
    }

    if (!regex.test(email))
      return res.status(400).json({
        success: false,
        message: "Invalid email input.",
      });

    if ( !password  || password.trim() === "")
      return res.status(400).json({
        success: false,
        message: "Invalid password input.",
      });

    if (role === null || role.trim() === "")
      return res.status(400).json({
        success: false,
        message: "Invalid role input.",
      });

    if (await userModel.exists({ email })) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    return res.status(200).json({
      success: true,
      message: "User registered Successfully.",
    });
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    let { email, password } = req.body;

    if (!regex.test(email))
      return res.status(400).json({
        success: false,
        message: "Invalid email input.",
      });

    if (password === undefined || password === null || password.trim() === "")
      return res.status(400).json({
        success: false,
        message: "Invalid password input.",
      });

    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user exists with this mail !",
      });
    }

    let isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    );

    const refreshToken = jwt.sign(
      { id: user._id, token_type: "refresh" },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
    );

    //       Session

    let sessionAlreadyExists = await sessionModel.findOne({
      userId: user._id,
      isActive: true,
    });

    if (sessionAlreadyExists) {
      let session = await sessionModel.findOneAndUpdate(
        { userId: user._id, isActive: true },
        {
          lastActivity: new Date(),
          isActive: false,
          logoutTime: new Date(),
        },
        { returnDocument: "after" },
      );
    }

    let loginTime = new Date();
    let expiresAt = new Date(loginTime);
    expiresAt.setDate(expiresAt.getDate() + 7);

    let getDevice = (req) => {
      if (req.useragent.isMobile) return "Mobile";
      if (req.useragent.isDesktop) return "Laptop";
      if (req.useragent.isTablet) return "Tablet";
      return "Unknown";
    };

    const session = await sessionModel.create({
      userId: user._id,
      refreshToken: refreshToken,
      device: getDevice(req),
      browser: req.useragent.browser,
      ipAddress: req.ip,
      loginTime,
      lastActivity: new Date(),
      expiresAt,
      isActive: true,
      logoutTime: null,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: process.env.ACCESS_TOKEN_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: process.env.REFRESH_TOKEN_AGE,
    });

    return res.status(200).json({
      success: true,
      message: "Login Successfully....",
    });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    let { id } = req.params;

    if (!id || id.trim() === "")
      return res.status(400).json({
        success: false,
        messaeg: "Invalid ID.",
      });

    let user = await userModel.findOne({ _id: id });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "No user exists with this id ",
      });

    await userModel.findByIdAndDelete(id);
    await sessionModel.deleteMany({ userId: id });
    return res.status(200).json({
      success: true,
      message: "User deleted successful",
    });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    let { name, email, password } = req.body;
    let _id = req.params.id.trim();

    if (!_id || typeof _id !== "string")
      return res.status(404).json({
        success: false,
        message: "Invalid Id.",
      });

    if (!(await userModel.exists({ _id })))
      return res.status(404).json({
        success: false,
        message: "user not found",
      });

    let updateData = {};

    if (typeof name === "string" && name.trim() !== "") {
      if (name.trim().length < 3)
        return res.status(400).json({
          success: false,
          message: "Name must be at least 3 characters long..",
        });
      updateData.name = name;
    }

    if (regex.test(email)) updateData.email = email;

    if ( password && password.trim() !== "") {
      let hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updateUser = await userModel.findOneAndUpdate(
      { _id },
      updateData,
      {
        returnDocument: "after",
      },
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
    });
  } catch (err) {
    next(err);
  }
}

async function toRefreshToken(req, res, next) {
  try {
    let refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await userModel.findOne({ _id: decoded.id });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}` },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: process.env.ACCESS_TOKEN_AGE,
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully.",
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      await sessionModel.findOneAndUpdate(
        {
          refreshToken: req.cookies.refreshToken,
          isActive: true,
        },
        { isActive: false, logoutTime: new Date() },
        { returnDocument: "after" },
      );

      return res.status(401).json({
        success: false,
        message: "Session Ended",
      });
    }
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    let refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).json({
        success: false,
        message: "You are not logged in.",
      });

    let decoded = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    let userSession = await sessionModel.findOneAndUpdate(
      { userId: decoded.id, refreshToken: refreshToken },
      {
        lastActivity: new Date(),
        logoutTime: new Date(),
        isActive: false,
      },
    );

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (err) {
    next(err);
  }
}



export {
  deleteUser,
  loginUser,
  logout,
  registerUser,
  toRefreshToken,
  updateUser,
};
