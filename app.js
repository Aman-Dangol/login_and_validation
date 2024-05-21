const express = require("express");
// setting up database
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const { auth } = require("./auth.js");
const connection = mysql.createConnection({
  host: "localhost",
  user: "aman",
  password: "root",
  database: "login",
});

const app = express();

let error = "";

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("./public"));
// set up view engine
app.set("view engine", "ejs");
app.use(/\/.+/, auth);
app.get("/", (req, res) => {
  res.render("login", {
    emailErr: error.emailErr,
    passwordErr: error.passwordErr,
  });
  error = "";
});

app.get("/sign-up", (req, res) => {
  res.render("signup", { err: error });
});
app.post("/sign-up", (req, res) => {
  const { email, password } = req.body;
  connection.query(
    `insert into users(email,password) values ('${email}','${password}')`,
    (err, data) => {
      if (err) {
        error = "email already in use ";
        res.redirect("/sign-up");
        return;
      }
      res.redirect("/");
    }
  );
});

app.post("/signIn", (req, res) => {
  const { email, password } = req.body;
  connection.query(
    `select * from users where email = '${email}'`,
    (err, data) => {
      if (!data.length) {
        error = {
          emailErr: "email doesnt exist",
          passwordErr: "",
        };
        res.redirect("/");
        return;
      }
      const dbPassword = data[0].password;
      if (dbPassword != password) {
        error = { emailErr: "", passwordErr: "password doesnt match" };
        res.redirect("/");
        return;
      }
      res.cookie("uid", data[0].id);
      res.send("login was a success");
    }
  );
});

app.get("/home", (req, res) => {
  res.send("home page");
});
app.listen(8000);
