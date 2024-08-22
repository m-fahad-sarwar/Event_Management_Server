const mongoose = require("mongoose");
const moment = require("moment");
const Event = require("../models/event");
const Rating = require("../models/rating");
const { getDistance } = require("../../config/helper");

exports.addEvent = async (req, res) => {
  const event = new Event(req.body);
  event
    .save()
    .then(result => {
      res.status(200).send({
        success: true,
        message: "Event created successfully",
      })
    })
    .catch((err) => {
      res.status(200).send({
        success: false,
        error: "Something went wrong",
      })
    })
};

exports.edit = (req, res, next) => {
  Event.updateOne({ _id: req.params.id }, { $set: req.body })
    .then(docs => {
      res.status(200).json({
        message: "Event edited successfully",
        success: true
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
        success: false
      });
    });
}

exports.get_by_near_location = (req, res) => {
  console.log("body", req.body);
  Event.find({ eventStartDate: { $gte: moment().format('YYYY/MM/DD') } })
    .then(async (docs) => {
      let result = docs.filter((item) => getDistance(item.lat, item.long, req.body.lat, req.body.long) <= 100)
      Rating.find({ eventID: { $in: result.map(s => s._id) } }).populate("userID")
        .then(reviews => {
          result = result.map(s => {
            const ratings = reviews.filter(r => String(r.eventID) === String(s._id))
            let averageRating = ratings.reduce((pVal, item) => pVal + (item?.star || 0), 0) / ratings.length
            averageRating = averageRating ? parseFloat(averageRating.toFixed(1)) : 0
            return { ...s.toJSON(), reviews: ratings, averageRating }
          })
          const results = result.sort((a, b) => {
            console.log(a.averageRating, b.averageRating);
            return b.averageRating - a.averageRating
          })
          res.status(200).json({ docs: results, success: true });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: "Something went wrong",
            success: false
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
        success: false
      });
    });

};

exports.getAllEvents = (req, res) => {
  Event.find()
    .then((docs) => {
      Rating.find({ eventID: { $in: docs.map(e => e._id) } })
        .populate("userID")
        .then(reviews => {
          docs = docs.map(s => {
            const ratings = reviews.filter(r => String(r.eventID) === String(s._id))
            let averageRating = ratings.reduce((pVal, item) => pVal + item?.star, 0) / ratings.length
            averageRating = averageRating ? parseFloat(averageRating.toFixed(1)) : 0
            return { ...s.toJSON(), reviews: ratings, averageRating }
          })
          const events = docs.sort((a, b) => {
            console.log(a.averageRating, b.averageRating);
            return b.averageRating - a.averageRating
          })
          res.status(200).json({ docs: events, success: true });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            error: "Something went wrong",
            success: false
          });
        })
    })
    .catch((err) => {
      console.log('err: ', err);
      res.status(404).json({ error: "Something went wrong", success: false })
    });
};

exports.getSingleEvent = (req, res) => {
  Event.findOne({ _id: req.params.id })
    .then((doc) => {
      Rating.find({ eventID: doc?._id })
        .populate("userID")
        .then((reviews) => {
          let averageRating = (reviews.reduce((pVal, item) => pVal + item.star, 0) / reviews.length).toFixed(1)
          averageRating = averageRating || 0
          res.status(200).json({ ...doc.toJSON(), reviews, averageRating });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            error: "Something went wrong",
            success: false
          });
        });
    })
    .catch((err) => {
      console.log('err: ', err);
      res.status(404).json({ error: "Something went wrong", success: false })
    });
};

exports.getByUser = (req, res) => {
  Event.find({ userID: req.params.userID })
    .then((docs) => {
      Rating.find({ eventID: { $in: docs.map(e => e._id) } })
        .populate("userID")
        .then(reviews => {
          docs = docs.map(s => {
            const ratings = reviews.filter(r => String(r.eventID) === String(s._id))
            let averageRating = ratings.reduce((pVal, item) => pVal + item?.star, 0) / ratings.length
            averageRating = averageRating ? parseFloat(averageRating.toFixed(1)) : 0
            return { ...s.toJSON(), reviews: ratings, averageRating }
          })
          const events = docs.sort((a, b) => {
            console.log(a.averageRating, b.averageRating);
            return b.averageRating - a.averageRating
          })
          res.status(200).json({ docs: events, success: true });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            error: "Something went wrong",
            success: false
          });
        })
    })
    .catch((err) => {
      console.log('err: ', err);
      res.status(404).json({ error: "Something went wrong", success: false })
    });
};

exports.delete = (req, res) => {
  Event.deleteOne({ _id: req.params.id })
    .then((docs) => {
      res.status(200).json({
        success: true,
        message: "Event deleted successfully"
      })
    })
    .catch((err) => {
      console.log('err: ', err);
      res.status(400).json({
        success: false,
        error: "Something went wrong"
      })
    })
}