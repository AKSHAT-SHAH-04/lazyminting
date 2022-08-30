require("dotenv").config({ path: "./../../../.env" });

const mongoose = require("mongoose");
const { logger } = require("../config/logger.js");

logger.info(process.env.DB_URL);

const DB = process.env.DB_URL;

const dbConnect = mongoose
 .connect(DB)
 .then(() => logger.info("DB connection successful!"));

module.exports = { dbConnect };
