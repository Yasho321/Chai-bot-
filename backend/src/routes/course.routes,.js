import {Router } from 'express';
import { isLoggedIn , isAdmin } from '../middlewares/auth.middlewares.js';
import { createCourse, getCourses } from '../controllers/course.controllers.js';


const router = Router();

router.post("/", isLoggedIn, isAdmin,createCourse)


router.get("/" , isLoggedIn, isAdmin , getCourses)



export default router;