import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//generateToken
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//user Register
export const RegisterUser = async (request, response) => {
  try {
    const { name, email, password } = request.body;

    //validation of form
    if (!name || !email || !password) {
      return response.status(400).json({ message: "All fields are required" });
    }

    // email formate

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return response.status(400).json({ message: "Invalid email format" });
    }

    //password strenth checking

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return response.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    //check if user is exist or not
    const existUser = await User.findOne({ email });

    if (existUser) {
      return response.status(400).json({ message: "User allready Exist !" });
    }

    //hashing password

    const HashedPassword = await bcrypt.hash(password, 10);

    // crating user
    const user = await User.create({
      name,
      email,
      password: HashedPassword,
    });

    response.status(201).json({ message: "User Registered Successfully !" });
  } catch (e) {
    response.status(500).json({ message: e.message });
  }
};

// user login
export const LoginUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: "All Fileds are Required!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return response
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return response
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    response.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};
