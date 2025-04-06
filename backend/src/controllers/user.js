import { User } from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
import { OAuth2Client } from "google-auth-library";

export const googleLogin = async (req, res) => {
  const {username, email, isStudent, university, password, city}=req.body;
  try {
    const newUser=new User({
      username,
      email,
      isStudent,
      university,
      password,
      city
    });
    const saveduser=await newUser.save();
    console.log(saveduser);
    res.status(200).json(saveduser);
  } catch (error) {
    console.log(error);
  }
};