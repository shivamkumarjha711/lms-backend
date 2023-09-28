import { Router } from "express";
import { contactForm } from "../controllers/contact.controller.js";

const router = new Router();

router.post("/contact", contactForm);

export default router;