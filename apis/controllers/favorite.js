const Favorite = require("../models/favorite");
const Rating = require("../models/rating");

exports.create_favorite = (req, res) => {
  console.log(req.body);
  const fav = new Favorite(req.body);
  fav
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Favorite store created successfully",
        _id: result._id,
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

exports.get_favorite_by_userID = (req, res) => {
  Favorite.find({ userID: req.params.id })
    .populate("eventID")
    .populate("userID")
    .then((doc) => {
      let f = doc.map(s => s?.fID)
      Rating.find(
        {
          $or: [
            { eventID: { $in: f } },
            { placeID: { $in: f } },
          ]
        }
      )
        .populate("userID")
        .then(reviews => {
          doc = doc.map(s => {
            // filtering to get reviews of store
            const ratings = reviews.filter(r => String(r.eventID?.id) || String(r.placeID?.id) === String(s.fID))
            console.log('ratings: ', ratings);
            // reduce to count the stars field in review.stars
            let averageRating = ratings.reduce((pVal, item) => pVal + item?.star, 0) / ratings.length
            averageRating = averageRating ? parseFloat(averageRating.toFixed(1)) : 0
            return { ...s.toJSON(), reviews: ratings, averageRating }
          })
          const docs = doc.sort((a, b) => {
            console.log(a.averageRating, b.averageRating);
            return b.averageRating - a.averageRating
          })
          res.status(200).json(docs);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: "Something went wrong",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Something went wrong",
      });
    });
};

exports.delete_favorite = (req, res) => {
  Favorite.deleteOne({ _id: req.params.id })
    .then((docs) => {
      console.log(docs);
      res.status(200).json({
        message: "Successfully Deleted Favorite",
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
