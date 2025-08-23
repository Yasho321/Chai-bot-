import {Router } from 'express';
import { isLoggedIn , isAdmin} from '../middlewares/auth.middlewares.js';

import {  uploadVtts } from '../controllers/upload.controllers.js';
import { uploadMany } from '../utils/multer.js';



const router = Router();


router.post("/video/:chapter/:course", isLoggedIn,isAdmin, uploadMany,uploadVtts)





export default router;