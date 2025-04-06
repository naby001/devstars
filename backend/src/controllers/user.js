import { User } from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googlelogin= async (req, res) => {
    res.status(200).json('rec');
}


export const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // You can now use the info to find or create the user in your DB
    // Example:
    let user = await User.findOne({ email });
    // if (!user) {
    //   user = await User.create({
    //     email,
    //     name,
    //     googleId: sub,
    //     avatar: picture,
    //   });
    // }
   console.log(user);
    // Optionally generate your own JWT or session
    res.status(200).json({
      message: 'User logged in successfully',
      user,
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(400).json({ message: 'Invalid Google token' });
  }
};