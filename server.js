var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var apiRouter = require("./routes/index");
var db = require("./models/index");
var cors = require("cors");
require("dotenv").config();
const multer = require("multer");

app.use(cors());

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/multiapi", apiRouter);

app.use(express.static(`${__dirname}/uploads`));
app.post("/uploadimage", (req, res) => {
  // 10 is the limit I've defined for number of uploaded files at once
  // 'multiple_images' is the name of our file input field
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  const foldername = req.params.foldername;
  let upload = multer({ storage: storage }).array("multiple_images", 10);

  upload(req, res, function (err) {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    if (err) {
      console.log("error", err);
    }
    //else if (...) // The same as when uploading single images

    let result = "";
    const files = req.files;
    console.log("files", files);
    let index, len;

    // Loop through all the uploaded images and display them on frontend
    for (index = 0, len = files.length; index < len; ++index) {
      result += `/${files[index].filename}`;
      if (index < files.length - 1) {
        result += ",";
      }
    }
    // result += '<hr/><a href="./">Upload more images</a>';
    res.send(result);
  });
});
//app.use(express.static(`${__dirname}/uploads`));

db.mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

const port = process.env.PORT || 8090;

app.listen(port, (req, res) => {
  console.log(`server is running on port ${port}`);
});
