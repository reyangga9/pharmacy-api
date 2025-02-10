import express from "express";
import pharmacy_item_details from "../controllers/pharmacy_item_details.js";

const router = express.Router();

router.get("/", pharmacy_item_details.getAllPharmacyItemDetails);

export default router;
