const express = require("express");
const googleRoutes = require("./google");
const weatherRoutes = require("./weather");

const router = express.Router();

router.use("/", googleRoutes);
router.use("/", weatherRoutes);

module.exports = router;