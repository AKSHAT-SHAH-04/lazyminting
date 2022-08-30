const express = require("express");
const router = express.Router();

const { getNft, createItem, getUserItems } = require("../controllers/items");

router.get("/", getNft);

router.post("/create", createItem);

router.get("/views/:id", getUserItems);

module.exports = router;
