const Favourite = require("../models/favourite");

exports.addFavourite = async (req, res) => {
  const fav = new Favourite(req.body);
  fav
    .save()
    .then(result => {
      res.status(200).send({
        success: true,
        message: "Favourite created successfully",
      })
    })
    .catch((err) => {
      res.status(200).send({
        success: false,
        error: "Something went wrong",
      })
    })
};

exports.edit = (req, res) => {
  Favourite.updateOne({ _id: req.params.id }, { $set: req.body })
    .then(docs => {
      res.status(200).json({
        message: "Favourite edited successfully",
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

exports.getAllFavourites = (req, res) => {
  Favourite.find()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log('err: ', err);
      res.status(404).json({ error: "Something went wrong", success: false })
    });
};

exports.getByUserFavourite = (req, res) => {
  Favourite.find({ userID: req.params.id })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      console.log('err: ', err);
      res.status(404).json({ error: "Something went wrong", success: false })
    });
};

exports.delete = (req, res) => {
  Favourite.deleteOne({ _id: req.params.id })
    .then((docs) => {
      res.status(200).json({
        success: true,
        message: "Favourite deleted successfully"
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