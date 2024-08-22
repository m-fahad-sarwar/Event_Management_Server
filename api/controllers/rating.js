const Rating = require("../models/rating");

exports.create_Rating = (req, res) => {
  const rating = new Rating(req.body);
  rating
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Created rating successfully",
        success: true
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

exports.get_rating = (req, res, next) => {
  console.log(req.params);
  Rating.find({ id: req.params.id })
    .populate("userID")
    .then(reviews => {
      res.status(200).json({
        reviews,
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

exports.edit_Rating = (req, res) => {
  Rating.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  )
    .then((docs) => {
      console.log(docs);
      res.status(200).json({
        message: "Rating edited successfully",
        success: true
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

exports.delete_Rating = (req, res) => {
  Rating.deleteOne({ _id: req.params.id })
    .then((docs) => {
      res.status(200).json({
        message: "Rating deleted successfully",
        success: true
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
