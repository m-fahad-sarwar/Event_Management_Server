var express = require("express")
require('dotenv').config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
let logger = require("morgan");
var app = express();
const server = require('http').createServer(app);

const userRoutes = require("./api/routes/user");
const eventRoutes = require("./api/routes/event");
const ratingRoutes = require("./api/routes/rating");
const favouriteRoutes = require("./api/routes/favourite");
const ticketRoutes = require("./api/routes/ticket");
const favoriteRoutes = require("./api/routes/favorite");

var cors = require("cors");
app.use(express.json({ limit: "50mb" }));
app.use(cors({
  origin: '*'
}));

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "1000kb" }));
app.use(logger("dev"));

const db = process.env.MONGODB_URI
//connect to MongoDB
mongoose.set('strictQuery', true)
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/user", userRoutes);
app.use("/event", eventRoutes);
app.use("/rating", ratingRoutes);
app.use("/favourite", favouriteRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/ticket", ticketRoutes);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server is running on port ${port}`));
