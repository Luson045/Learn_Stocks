const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const All = require('../models/all');
const Rate = require('../models/Ratings');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: "../.env" });
// JWT Secret
const jwtSecret = process.env.JWT_KEY; // Replace with a strong secret
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  //console.log(token);
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded.user;
      //console.log(req.user);
      next();
  } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
  }
};
// Sample GET routes

router.post('/rate', async(req,res)=>{
    try{
        const rating = new Rate({
            name: req.body.name,
            rating: req.body.rating,
            review:  req.body.review,
        });
        await rating.save();
        return res.status(200).json("Thank You for rating us!");
    }
    catch{
        return res.status(200).json("Some error occured in server side handling! Still thanks for your time :)");
    }
})
router.post('/adduser', async(req,res)=>{
    try{
        const usercount = await All.findById('6690ca4a20864065e32fb656');
        usercount.names[0] = usercount.names[0]+1;
        await usercount.save();
        return res.status(200).json(usercount.names[0]);
    }
    catch{
        return res.status(200).json("Some error occured in server side handling! Still thanks for your time :)");
    }
})
router.post('/demat/add',auth, async(req,res)=>{
    try{
        const user = await User.findById(req.user.id);
        user.demat_amnt = user.demat_amnt + req.body.amount;
        await user.save();
        return res.status(200).json("Successfully added, Happy trading!");
    }
    catch{
        return res.status(200).json("OOPS! Looks like we faced an error!");
    }
})
router.get('/profile', auth, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});
router.get('/demat/add', (req, res) => {
    res.send({ message: "Added to the Demat Page!" });
});
router.get('/demat/withdraw', (req, res) => {
    res.send({ message: "Withdrawn from the Demat Page!" });
});
// Register User
router.post('/register', async (req, res) => {
    const { name, email, password, terms } = req.body;
    const newmail = email.toLowerCase();
    //console.log(name, email, password);
    try {
        let user = await User.findOne({ email: newmail });
        if (!user) {
            const verificationToken = crypto.randomBytes(20).toString('hex');
            const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

            user = new User({
                name: name,
                email: newmail,
                password: password,
                terms: terms,
                isVerified: false,
                verificationToken: verificationToken,
                verificationExpires: verificationExpires
            });
    
            // Hash password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
    
            await user.save();
    
            // Send verification email
            const transporter = nodemailer.createTransport({
                service: 'Gmail', // e.g., 'Gmail'
                auth: {
                    user: 'yuria4489@gmail.com',
                    pass: process.env.APP_PASS
                }
            });
    
            const mailOptions = {
                from: 'yuria4489@gmail.com',
                to: newmail,
                subject: 'Email Verification',
                html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            color: #4CAF50;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #fff;
            background-color: #e74c3c;
            text-decoration: none;
            border-radius: 5px;
        }
        p {
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Learn Stocks!</h1>
        <p>Dear User,</p>
        <p>Thank you for registering with <strong>Learn Stocks</strong>, your comprehensive platform for mastering the stock market. We provide real-time data, expert insights, and a supportive community to help you navigate the complexities of stock trading.</p>
        <p>Please verify your email address to complete your registration. Click the button below to verify your email:</p>
        <a href="https://learn-stocks.onrender.com/api/verify-email?token=${verificationToken}" class="button">Verify Email</a>
        <p>If you did not create an account, please disregard this email.</p>
        <p>Best regards,<br>The Learn Stocks Team</p>
    </div>
</body>
</html>
`
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json('Email could not be sent');
                }
                res.json({ msg: 'Verification email sent. Please check your email.' });
            });
        } else {
            return res.status(400).json({ msg: 'User already exists' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server error');
    }
});
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        let user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        if (user.verificationExpires < Date.now()) {
            await User.findByIdAndDelete(user._id);
            return res.status(400).json({ msg: 'Token expired. Please register again.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();
        const payload = { user: { id: user.id } };
        jwt.sign(payload, jwtSecret, { expiresIn: 3600 * 3 }, (err, token) => {
            if (err) throw err;
            res.redirect(`https://learnstocks.netlify.app/profile?token=${token}`);
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server error');
    }
});


// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const newmail = email.toLowerCase();
    //console.log(newmail);

    try {
        let user = await User.findOne({ email:newmail });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials[name]" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Create and return JWT
        const payload = { user: { id: user.id } };
        jwt.sign(payload, jwtSecret, { expiresIn: 3600*3 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});
router.post('/logout', auth, async(req,res)=>{
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logout successful" });
      } catch (error) {
        console.error("Error during logout:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
});

module.exports = router;
