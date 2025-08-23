import {Router } from 'express';
import { isLoggedIn , isAdmin } from '../middlewares/auth.middlewares.js';
import { createChapter, getChapters } from '../controllers/chapter.controllers.js';


const router = Router();

router.post("/", isLoggedIn, isAdmin,createChapter)


router.get("/" , isLoggedIn, isAdmin , getChapters)



export default router;