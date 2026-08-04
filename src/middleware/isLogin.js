import sessionModel from "../model/sessionModel.js";
import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function isLogin(req, res, next) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    let session = await sessionModel.findOneAndUpdate(
      {
        userId: decoded.id,
        refreshToken: req.cookies.refreshToken,
        isActive: true,
      },
      { lastActivity: new Date() },
      { returnDocument: "after" },
    );

    if (!session)
      return res.status(302).json({
        success: false,
        message: "Session Ended",
      });

    req.user = decoded;
    next();
  } catch (err) {
    
    try {
      if (err.name === "TokenExpiredError" || !accessToken) {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
        );

        const user = await userModel.findById(decoded.id);
        console.log(user)
        const newAccessToken = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
        );

        let session = await sessionModel.findOneAndUpdate(
          {
            userId: decoded.id,
            refreshToken: req.cookies.refreshToken,
            isActive: true,
          },
          { lastActivity: new Date() },
          { returnDocument: "after" },
        );

        if (!session)
          return res.status(401).json({
            success: false,
            meesage: "Session Ended",
          });

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
          maxAge: process.env.ACCESS_TOKEN_AGE,
        });

        req.user = decoded;
        next();
      } else {
        next(err);
      }
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
}

async function isAdmin(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!(decoded.role === "admin"))
      return res.status(403).json({
        success: false,
        message: "Only admin can access",
      });
      next()
  } catch (err) { next(err)}
}

export { isAdmin, isLogin };

