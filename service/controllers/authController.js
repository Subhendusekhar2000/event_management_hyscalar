const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
    });

    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully!", data: user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

function generateStrongPassword(length = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

exports.login = async (req, res) => {
  try {
    let { email = "", password = "", googleLogin = "" } = req.body;

    if (googleLogin) {
      let { email, name } = parseJwt(googleLogin);
      let user = await User.findOne({ email });

      if (!user) {
        password = generateStrongPassword();
        console.log(password);
        const userData = new User({
          name,
          email,
          password,
        });
        await userData.save();

        const payload = {
          id: userData.id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: 3600,
        });

        return res.json({ token, data: userData });
      } else {
        const payload = {
          id: user.id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: 3600,
        });

        return res.json({ token, data: user });
      }
    } else {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      const payload = {
        id: user.id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 3600,
      });

      return res.json({ token, data: user });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
