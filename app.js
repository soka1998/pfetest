var createError = require("http-errors");
var express = require("express");
const cors = require('cors');
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var withAuth = require("./withAuth");

const db = require("./models");
require("dotenv").config();
console.log('User:', process.env.DATABASE_USER);
console.log('Password:', process.env.DATABASE_PASSWORD);
console.log('Database:', process.env.DATABASE_NAME); 
console.log('port :', process.env.DATABASE_PORT); 





var api = require("./routes/api");
var login = require("./routes/login/login.routes");
var register = require("./routes/register/register.routes");
const { PORT } = require("./config/db.config");

var app = express();
app.use(cors());

// global.__basedir = __dirname;

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// var corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200
// }

db.sequelize.sync({ alter: true }).then(()=>{
  console.log("Database is synced");
}).catch(err => ("databse failed sync",err));

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

app.use("/api", api);
app.use("/login", login);
app.use("/register", register);

app.get("/checkToken", withAuth.checkToken);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
// Start the server and log the port
const port = process.env.PORT|| 3006;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
