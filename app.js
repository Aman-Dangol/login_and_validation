const express = require("express");
// setting up database
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "aman",
  password: "root",
  database: "login",
});

const app = express();

let error = "";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set up view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log(req.headers.cookie);
  res.cookie("cast", "");
  res.render("login", { err: error });
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
        res.redirect("/");
        return;
      }
      res.redirect("/");
    }
  );
});

app.listen(8000);
