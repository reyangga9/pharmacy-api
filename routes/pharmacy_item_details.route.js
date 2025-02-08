const express = require("express");
const router = express.Router();
const pharmacy_item_details = require("../controllers/pharmacy_item_details");

// router.get("/pharmacy-item-details", pharmacy_item_details.getAllPharmacyItemDetails);
router.get("/",pharmacy_item_details.getAllPharmacyItemDetails)

module.exports = router;
