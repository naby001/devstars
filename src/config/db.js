const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  username: { type: String, required: true },
  universityName: { type: String, required: true },
  cityName: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = { connectDB, User };
