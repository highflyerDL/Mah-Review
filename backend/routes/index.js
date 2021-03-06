import { Router } from "express";
import postCtrl from "../controllers/postController";
import catCtrl from "../controllers/categoryController";
import authCtrl from "../controllers/authController";
import reviewCtrl from "../controllers/reviewController";
import userCtrl from "../controllers/userController";
import auth from "../middlewares/auth";
import multer from 'multer';
let storage = multer.memoryStorage();
let router = new Router();
let upload = multer({ storage: storage });

router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);
router.get('/facebook', authCtrl.facebook);
router.get('/facebook/callback', authCtrl.facebookCallback);


router.get('/user', auth, userCtrl.index);
router.put('/user/avatar',auth,upload.single('avatar'),userCtrl.changeAvatar)
router.put('/user', auth, userCtrl.update);


//router.post('/upload',auth,upload.array('files'),postCtrl.upload);
router.get('/post', postCtrl.index);
router.get('/post/:postId', postCtrl.show);
router.post('/post/:postId/close', postCtrl.close);
router.post('/post/', auth, upload.array('files'), postCtrl.create);
//need admin or owner validator
router.put('/post/:postId', auth, postCtrl.update);
router.delete('/post/:postId', auth, postCtrl.destroy);


router.get('/category', catCtrl.index);
router.post('/category', auth, catCtrl.create);
//need admin or owner validator
router.put('/category/:catId', auth, catCtrl.update);
router.delete('/category/:catId', auth, catCtrl.destroy);


router.post('/post/:postId/review', auth, reviewCtrl.create);
router.post('/review/:reviewId/:action', auth, reviewCtrl.doAction);
//need admin or owner validator
router.put('/review/:reviewId', auth, reviewCtrl.update);
router.delete('/review/:reviewId', auth, reviewCtrl.destroy);




export default router;
