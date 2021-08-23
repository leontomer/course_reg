const express = require("express");
const router = express.Router();
const register = require("../../models/register.model");
var nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");

router.post("/saveDetails", async (req, res) => {
  try {
    const { firstName, lastName, email, fullNumber, address, city } = req.body;
    let reg = await register.findOne({ email: email });
    let reg2 = await register.findOne({ phoneNumber: fullNumber });

    if (!reg && !reg2) {
      const reg = new register({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: fullNumber,
        address: address,
        city: city,
      });

      await reg.save();

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "coursemanager2@gmail.com",
          pass: "t!234567",
        },
      });

      var mailOptions = {
        from: "coursemanager2@gmail.com",
        to: "coursemanager2@gmail.com",
        subject: "new registration",
        text: `${firstName} ${lastName} from ${address} (contact info: ${email}/${fullNumber}) registered to the course.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(400).json("Error: " + error);
        }
      });

      const id = reg.id;
      const token = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(id));

      var mailOptions = {
        from: "coursemanager2@gmail.com",
        to: email,
        subject: "course registration",
        html: `you requested to register for our course.\n please confirm your registration. \n if you did not requested to register, please ignore this email \n
          <a href=https://tomer-am.herokuapp.com/confirmation/${token} > Click here to go to confirmation page</a>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(400).json("Error: " + error);
        }
      });

      res.json("ok");
    } else {
      res.json("user already registered");
    }
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

router.post("/confirmation", async (req, res) => {
  try {
    const { token } = req.body;

    let id = CryptoJS.enc.Base64.parse(token).toString(CryptoJS.enc.Utf8);

    let reg = await register.findById(id);

    if (reg && !reg.approved) {
      reg.approved = true;
      await reg.save();
      res.json("Confirmation completed!");
    } else if (reg && reg.approved) {
      res.json("you already confirmed your registration!");
    }
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

router.get("/registrations", async (req, res) => {
  try {
    const registrations = await register.find();
    res.json(registrations);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

router.post("/resendEmail", async (req, res) => {
  try {
    const { email } = req.body;

    let reg = await register.findOne({ email: email });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "coursemanager2@gmail.com",
        pass: "t!234567",
      },
    });

    const id = reg.id;
    const token = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(id));

    var mailOptions = {
      from: "coursemanager2@gmail.com",
      to: email,
      subject: "course registration",
      html: `you requested to register for our course.\n please confirm your registration. \n if you did not requested to register, please ignore this email \n
          <a href=https://tomer-am.herokuapp.com/confirmation/${token} > Click here to go to confirmation page</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(400).json("Error: " + error);
      }
    });

    res.json("ok");
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

module.exports = router;
