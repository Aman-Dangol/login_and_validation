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
app.use(express.urlencoded({ extended: false }));

// set up view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login", { err: error });
  error = "";
});

app.post("/sign-up", (req, res) => {
  const { email, password } = req.body;
  connection.query(
    `insert into users(email,password) values ('${email}','${password}')`,
    (err, data) => {
      if (err.code == "ER_DUP_ENTRY") {
        error = "email already in use ";
        res.redirect("/");
        return;
      }
      res.send("success");
    }
  );
});

app.listen(8000);
