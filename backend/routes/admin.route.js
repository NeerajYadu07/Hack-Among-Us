import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getGeoLocation } from "../controllers/admin.controller.js";

const router = express.Router();

router.route("/getgeolocation").post(getGeoLocation);

export default router;
