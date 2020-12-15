// Requiring path to so we can use relative routes to our HTML files
let path = require("path");
let router = require("express").Router();
let apiRoutes = require("./api");

router.use("/api", apiRoutes);

if (process.env.NODE_ENV === "production") {
    router.use(function(req, res) {
      res.sendFile(path.join(__dirname, "../client/build/index.html"));
    });
  }else{
    router.use(function(req, res) {
      res.sendFile(path.join(__dirname, "../client/public/index.html"));
    });
}
  
module.exports = router;