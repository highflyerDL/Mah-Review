import { Router } from "express";
import * as ctrlAuth from "../controllers/auth.controllers";
var router = new Router();

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login)
export default router;
