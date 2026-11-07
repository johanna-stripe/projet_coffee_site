import express from "express";
import {sendContactMessage} from "../controllers/contactController.js";

const router = express.Router();
export default router

//===================POST========================
router.post('/', sendContactMessage)
