var express = require("express");
var router = express.Router();

/* GET Help page */
router.get("/", function (req, res, next) {
  res.render("help", { title: "Help & Support" });
});

module.exports = router;