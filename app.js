const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");

const app = express();
// Connect DB
const dbURL =
  "mongodb+srv://irfan:irfan1234@teachebase.mzoeh.mongodb.net/smartedu?retryWrites=true&w=majority"; // database ile bağlantı kuracağımız adres yapısı.
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log("Db connected successfuly"))
  .catch((error) => {
    console.log(error);
  }); // db ile bağlantı kurma esnasında yürütülecek fonksiyonlar.

//Template Engine
app.set("view engine", "ejs");

// Global veriable
global.userIN = null;

//Middlewares

app.use(express.static("public/css-20220225T183828Z-001"));
app.use(express.static("public/fonts-20220225T183849Z-001"));
app.use(express.static("public/images-20220225T183907Z-001"));
app.use(express.static("public/js-20220225T184138Z-001"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my_keyboard_cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://irfan:irfan1234@teachebase.mzoeh.mongodb.net/smartedu?retryWrites=true&w=majority",
    }),
  })
);
app.use(flash());
// flash dan gelen mesajları bir değişkene alalım
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//Routes
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});

app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);

const port = process.env.Port || 5000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
