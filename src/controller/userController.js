import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import sessionModel from "../model/sessionModel.js";
import userModel from "../model/userModel.js";
dotenv.config();

async function registerUser(req, res, next) {
  try {
    let { name, email, password, role } = req.body;

    if (!(name === undefined || name === ""))
      if (!!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        if (!(password === undefined || password === ""))
          if (!(role === "")) {
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

            {
              // const accessToken = jwt.sign(
              //   { id: newUser._id, email: newUser.email, role: newUser.role },
              //   process.env.ACCESS_TOKEN_SECRET,
              //   { expiresIn: "15m" },
              // );
              // const refreshToken = jwt.sign(
              //   { id: newUser._id, email: newUser.email, role: newUser.role },
              //   process.env.REFRESH_TOKEN_SECRET,
              //   { expiresIn: "7d" },
              // );
              // newUser.refreshToken = refreshToken;
              // await newUser.save();
              // res.cookie("accessToken", accessToken, {
              //   httpOnly: true,
              //   sameSite: "lax",
              //   secure: false,
              //   maxAge: 15 * 60 * 1000,
              // });
              // res.cookie("refreshToken", refreshToken, {
              //   httpOnly: true,
              //   sameSite: "lax",
              //   secure: false,
              //   maxAge: 7 * 24 * 60 * 60 * 1000,
              // });
            }

            return res.status(200).json({
              success: true,
              message: "User registered Successfully.",
            });
          }

    res.status(400).json({
      success: false,
      message: "Invalid input data.",
    });
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    let { email, password } = req.body;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      if (!(password === undefined || password === "")) {
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
          { expiresIn:process.env.ACCESS_TOKEN_EXPIRE },
        );

        const refreshToken = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn:process.env.REFRESH_TOKEN_EXPIRE },
        );

        user.refreshToken = refreshToken;
        await user.save();

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
          refreshToken: user.refreshToken,
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
          maxAge: `${process.env.ACCESS_TOKEN_AGE}`,
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
      }

    res.status(400).json({
      success: false,
      message: "Invalid input data.",
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

    const user = await userModel.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });

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

    res.status(200).json({
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

    let user = await userModel.findOneAndUpdate(
      { email: decoded.email },
      { refreshToken: null },
      { returnDocument: "after" },
    );

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });

    let userSession = await sessionModel.findOneAndUpdate(
      { userId: user._id, refreshToken: refreshToken },
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

    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (err) {
    next(err);
  }
}

export { loginUser, logout, registerUser, toRefreshToken };

