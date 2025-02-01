const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  console.log("flashhh-=====", message);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid Email or password");
        return res.redirect("/login");
      }

      return bcrypt
        .compare(password, user.password)
        .then((isLegitUser) => {
          if (!isLegitUser) {
            return res.redirect("/login");
          }

          req.session.isLoggedIn = true;
          return res.redirect("/");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.redirect("/signup");
      }

      return bcrypt.hash(password, 12);
    })
    .then((password) => {
      const newUser = new User({
        name,
        email,
        password,
        cart: { items: [] },
      });

      return newUser.save();
    })
    .then((user) => {
      res.redirect("/login");
    })
    .catch((err) => console.log("Error while finding user", err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
