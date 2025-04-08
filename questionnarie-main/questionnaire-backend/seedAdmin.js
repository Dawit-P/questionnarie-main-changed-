const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/questionnaire", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB successfully!");

    // // Check if admin already exists
    // const existingAdmin = await User.findOne({ username: "admin" });
    // if (existingAdmin) {
    //   console.log("Admin user already exists.");
    //   process.exit(0);
    // }

    const hashedPassword = await bcrypt.hash("admin@123", 10);

    const adminUser = new User({
      username: "admin",
      email: "admin@mail.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
};

seedAdmin();
