const Ticket = require("../models/ticket");
const Event = require("../models/event");

exports.addTicket = async (req, res) => {
  let eId = req.body.eventID
  let e = await Event.findById({ _id: eId })
  if (e.totalCount >= e.limit) {
    return res.status(400).send({
      success: false,
      message: "Limit reached",
    })
  }
  const newDate = new Date().getTime().toString()
  let tn = newDate.substring(0, 5)
  const fav = new Ticket({ ...req.body, ticketNo: tn });
  fav
    .save()
    .then(async (result) => {
      let updateNotiCount = await Event.updateOne({ _id: eId }, { $inc: { totalCount: 1 } });
      console.log('updateNotiCount: ', updateNotiCount);
      res.status(200).send({
        success: true,
        message: "Ticket created successfully",
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
  Ticket.updateOne({ _id: req.params.id }, { $set: req.body })
    .then(docs => {
      res.status(200).json({
        message: "Ticket edited successfully",
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

exports.getAllTickets = (req, res) => {
  Ticket.find()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log('err: ', err);
      res.status(404).json({ error: "Something went wrong", success: false })
    });
};

exports.getByUserTicket = (req, res) => {
  Ticket.find({ userID: req.params.id }).populate('eventID')
    .then((doc) => {
      let f = doc.map(s => s?.eventID?._id)
      Rating.find({ eventID: { $in: f } })
        .populate("userID")
        .then(reviews => {
          doc = doc.map(s => {
            // filtering to get reviews of store
            const ratings = reviews.filter(r => String(r.eventID) === String(s.eventID?._id))
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
            success: false
          });
        });
    })
    .catch((err) => {
      console.log('err: ', err);
      res.status(404).json({ error: "Something went wrong", success: false })
    });
};

exports.delete = (req, res) => {
  Ticket.deleteOne({ _id: req.params.id })
    .then((docs) => {
      res.status(200).json({
        success: true,
        message: "Ticket deleted successfully"
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