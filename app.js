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
      res.send("login was a success");
    }
  );
  console.log(email, password);
});
app.listen(8000);
