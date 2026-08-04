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

  } catch (err) { next(err)}
}

// async function isLogin(req, res, next) {
//   const accessToken = req.cookies.accessToken;
//   const refreshToken = req.cookies.refreshToken;

//   try {
//     if (!accessToken && !refreshToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const decoded = await jwt.verify(
//       accessToken,
//       process.env.ACCESS_TOKEN_SECRET,
//     );
//     let session = await sessionModel.findOneAndUpdate(
//       { userId: decoded.id, refreshToken: req.cookies.refreshToken },
//       { lastActivity: new Date() },
//       { returnDocument: "after" },
//     );

//     req.user = decoded;
//     console.log("1");

//     next();
//   } catch (err) {
//     console.log("2");
//     if (err.name === "TokenExpiredError") {

//       console.log("Expire Token Detected");

//       const decoded = jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET,
//       );

//       const user = await userModel.findById(decoded.id);

//       if (!user || user.refreshToken !== refreshToken)
//         return res.status(403).json({
//           success: false,
//           message: "Forbidden",
//         });

//       const accessToken = jwt.sign(
//         { id: user._id, email: user.email, role: user.role },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: "1m" },
//       );
//       console.log("3");
//       res.cookie("accessToken", accessToken, {
//         httpOnly: true,
//         sameSite: "lax",
//         secure: false,
//         maxAge: 15 * 60 * 1000,
//       });
//       console.log("4");
//       next();
//     } else {
//       console.log("5");
//       return res.status(401).json({
//         success: false,
//         message: "Invalid Token",
//         error: err.message,
//       });
//     }
//   }
// }

// async function isAdmin(req, res, next) {
//   try {
//     const accessToken = req.cookies.accessToken;
//     const refreshToken = req.cookies.refreshToken;

//     if (!accessToken && !refreshToken) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

//     if (!(decoded.role === "admin"))
//       return res.status(403).json({
//         success: false,
//         message: "Only admin can access",
//       });

//     let session = await sessionModel.findOneAndUpdate(
//       { userId: decoded.id, refreshToken: req.cookies.refreshToken },
//       { lastActivity: new Date() },
//       { returnDocument: "after" },
//     );

//     req.user = decoded;
//     next();
//   } catch (err) {
//     if (err.name !== "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         error: err.message,
//       });
//     }

//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

//     const user = await userModel.findById(decoded.id);
//     if (!user || user.refreshToken !== refreshToken)
//       return res.status(403).json({
//         success: false,
//         message: "Forbidden",
//       });

//     const accessToken = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}` },
//     );

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: false,
//       maxAge: process.env.ACCESS_TOKEN_AGE,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Token refreshed successfully.",
//     });

//     next();
//   }
// }

export { isAdmin, isLogin };

