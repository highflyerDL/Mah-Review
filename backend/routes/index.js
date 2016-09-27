import { Router } from "express";
import * as fileCtrl from "../controllers/fileController";
import * as postController from "../controllers/postController";
import * as authCtrl from "../controllers/authController";
import multer from 'multer';
import auth from "../middlewares/auth";

let router = new Router();
let upload = multer({ dest: 'uploads/' });

router.post('/login',authCtrl.login);
router.post('/register',authCtrl.register);


router.get('/post',postController.index);
router.get('/post/:postId',postController.show);
router.get('/post/random',postController.random);
router.post('/post',auth,upload.array('files'),postController.create);
router.post('/post/review',auth,postController.reviewPost);


router.get('/file/:fileId',fileCtrl.getFile);

export default router;
