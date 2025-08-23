import {Router } from 'express';
import { isLoggedIn , isAdmin} from '../middlewares/auth.middlewares.js';

import { uploadChapter, uploadCourse, uploadVideo } from '../controllers/upload.controllers.js';




const router = Router();

router.post("/course", isLoggedIn ,isAdmin , uploadCourse)
router.post("/chapter/:course", isLoggedIn, isAdmin ,  uploadChapter)
router.post("/video/:chapter/:course", isLoggedIn,isAdmin, uploadVideo)





export default router;