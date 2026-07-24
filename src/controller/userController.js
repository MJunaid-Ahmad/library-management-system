import userModel from "../model/userModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();

async function registerUser(req, res, next) {
  try {
    let { name, email, password } = req.body;

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
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1m" },
    );

    res.cookie("token", token);

    res.status(200).json({
      success: true,
      message: "User registered Successfully",
      Token: token,
    });
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    let { email, password } = req.body;

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
        message: "Invalid password",
      });
    }
    res.status(200).json({
        success : true , 
        message: "Login Successfully...."
    });
  } catch (err) {
    next(err);
  }
}
export { registerUser, loginUser };
