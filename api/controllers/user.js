const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
let nodemailer = require('nodemailer');
let ejs = require('ejs');
let moment = require('moment');
let { generateCode } = require("../../config/helper");
const Event = require("../models/favourite");
require('dotenv').config();
const baseUrl = process.env.BASE_URL

const createToken = (payload) =>
  jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: "1h" });

exports.get_users = (req, res, next) => {
  User.find()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
      });
    });
};

exports.get_user_by_email = (req, res, next) => {
  User.find({ email: req.params.email })
    .then((docs) => {
      res.status(200).json({
        docs,
        success: true
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
      });
    });
};

exports.signup = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(200).json({
      success: false,
      message: "Please provide email and password"
    });
    return
  }
  console.log(req.body);
  User.find({ email: req.body.email })
    .then((docs) => {
      if (docs.length === 0) {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          const user = new User({ ...req.body, password: hash });
          user
            .save()
            .then((result) => {
              const token = createToken(result);
              res.status(200).json(
                {
                  success: true,
                  message: "Created user successfully",
                  token
                }
              );
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
                success: false
              });
            });
        });
      } else {
        res.status(200).json({
          message: "User already exist",
          success: false
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went wrong",
        success: false
      });
    });
};

exports.resetPassword = (async (req, res) => {
  console.log("body", req.body);
  const salt = await bcrypt.genSalt(10);
  var newPassword = await bcrypt.hash(req.body.password, salt);
  const userDetail = await User.find({ email: req.params.email })
  let email = req.params.email

  if (!userDetail.length) {
    res.send({ success: false, message: "user not exist" })
    return
  }
  User.updateOne(
    { email },
    {
      $set: { password: newPassword }
    }
  )
    .then(() => {
      return res.status(200).send({
        success: true,
        message: "password updated"
      })
    })
    .catch((err) => {
      console.log('err: ', err);
      res.status(400).send({
        error: err,
        success: false,
      });
    })
})

exports.sendEmailCode = async (req, res, next) => {
  const newCode = generateCode(5)
  const newDate = new Date()

  let mailerConfig = {
    host: "smtp.gmail.com",
    secureConnection: true,
    port: 465,
    secure: true,
    auth: {
      user: "eventnextdoorend@gmail.com",
      pass: "slpqhitbtqsnpneo"
    },
    tls: {
      rejectUnauthorized: false
    }
  };
  let transporter = nodemailer.createTransport(mailerConfig);
  ejs.renderFile("./view/signup.ejs", { email: Buffer.from(req.params.email).toString('base64'), code: newCode }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      var mainOptions = {
        from: mailerConfig.auth.user,
        to: req.params.email,
        subject: 'Welcome to Event Next Door!',
        html: data
      };
      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          console.log(err);
          return res.send({ success: false, error: "Please enter correct email!" })
        } else {
          console.log('Message sent: ' + info.response);
          return res.send({ msg: 'Message sent: ' + info.response, success: true, code: newCode, newDate })
        }
      });
    }
  })
};

exports.sendResetPassCode = async (req, res, next) => {
  console.log(req.params)
  let user = await User.findOne({ email: req.params.email });
  if (!user) {
    return res.status(200).send({
      success: false,
      message: "Please enter a valid email address",
    });
  }
  else {
    const newCode = generateCode(5)
    const newDate = new Date()
    let mailerConfig = {
      host: "smtp.gmail.com",
      secureConnection: true,
      port: 465,
      secure: true,
      auth: {
        user: "eventnextdoorend@gmail.com",
        pass: "slpqhitbtqsnpneo"
      },
      tls: {
        rejectUnauthorized: false
      }
    };
    let transporter = nodemailer.createTransport(mailerConfig);
    ejs.renderFile("./view/signup.ejs", { email: Buffer.from(req.params.email).toString('base64'), code: newCode }, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        var mainOptions = {
          from: mailerConfig.auth.user,
          to: req.params.email,
          subject: 'Event Next Door Reset Password',
          html: data
        };
        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            console.log(err);
            return res.send({ error: err.message })
          } else {
            console.log('Message sent: ' + info.response);
            return res.send({ msg: 'Message sent: ' + info.response, success: true, code: newCode, newDate })
          }
        });
      }
    })
  }
}

exports.login = (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.findOne({
      $or: [
        {
          email: req.body.email.toLowerCase(),
        },
        {
          userName: req.body.email.toLowerCase(),
        },
      ],
      isActive: true,
    })
      .then((result) => {
        bcrypt.compare(
          req.body.password,
          result?.password,
          (err, passwordNatched) => {
            if (passwordNatched) {
              const token = createToken(result);
              res.status(200).json({ success: true, token });
            } else {
              res.status(200).json({ success: false, message: "Invalid Email/Password" });
            }
          }
        )
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  }
  else {
    res.status(200).json({
      success: false,
      message: "Username and pass required",
    });
  }
};

exports.edit_user = (req, res) => {
  let body = req.body
  delete body.password
  delete body.email
  console.log(body);
  User.updateOne({ _id: req.params.id }, { $set: body })
    .then(async (docs) => {
      let data = await User.findOne({ _id: req.params.id })
      res.status(200).json({
        message: "User edited successfully",
        success: true,
        user: data
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
      });
    });
};

exports.changePassword = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((response) => {
      bcrypt.compare(
        req.body.oldPassword,
        response.password,
        (err, passwordMatched) => {
          if (passwordMatched) {
            bcrypt.compare(req.body.newPassword, response.password, (e, r) => {
              if (e) {
                res.send({ error: e })
              }
              if (r) {
                res.send({ success: false, error: "You have already used this password!" })
              } else {
                bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
                  User.updateOne(
                    { _id: req.params.id },
                    { $set: { password: hash } }
                  )
                    .then((docs) => {
                      res.status(200).json({
                        success: true,
                        message: "Password changed successfully!",
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(500).json({ error: "Something went wrong" });
                    });
                });
              }
            })
          } else {
            res.status(200).json({ success: false, message: "Invalid Old Password!" });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: "Something went wrong" });
    });
};

exports.delete_user = (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then((docs) => {
      res.status(200).json({
        message: "User deleted successfully",
        success: true
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
      });
    });
};
