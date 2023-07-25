import { Router } from "express";
import { isLoggedin } from "../middlewares/auth.middleware.js";
import { createCourse, getAllCourses, getLecturesByCourseId,
    updateCourse, removeCourse } from "../controllers/course.controller.js"
import upload from "../middlewares/multer.middleware.js";

const router = new Router();

router.route('/')
    .get(getAllCourses)
    .post(
        upload.single('thumbnail'),
        createCourse);

router.route('/:id')
    .get(isLoggedin, getLecturesByCourseId)
    .put(updateCourse)
    .delete(removeCourse);

export default router;