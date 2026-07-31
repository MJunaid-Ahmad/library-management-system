import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import sessionModel from "../model/sessionModel.js";
dotenv.config();

async function isLogin(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    let session = await sessionModel.findOneAndUpdate(
      { userId: decoded.id ,  refreshToken : req.cookies.refreshToken },
      { lastActivity: new Date() },
      { returnDocument: "after"  },
    );

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

async function isAdmin(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!(decoded.role === "admin")) 
      return res.status(403).json({
        success: false,
        message: "Only admin can access",
      });
    
    let session = await sessionModel.findOneAndUpdate(
      { userId: decoded.id ,  refreshToken : req.cookies.refreshToken },
      { lastActivity: new Date() },
      { returnDocument: "after"  },
    );

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message,
    });
  }
}

export { isAdmin, isLogin };

