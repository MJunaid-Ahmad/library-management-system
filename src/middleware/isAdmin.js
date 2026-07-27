import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function isAdmin(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        token: token,
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!(decoded.role === "admin")) {
     return res.status(401).json({
      success: false,
      message: "Only admin can access",
    });      
    }
    req.user = decoded ;
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message,
    });
  }
}

export default isAdmin;
