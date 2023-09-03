import { Router } from "express";
import { isLoggedin, authorizedsubscriber, authorizedRole } from "../middlewares/auth.middleware.js";
import { createCourse, getAllCourses, getLecturesByCourseId,
    updateCourse, removeCourse, addLectureByCourseId } from "../controllers/course.controller.js"
import upload from "../middlewares/multer.middleware.js";

const router = new Router();

router.route('/')
    .get(getAllCourses)
    .post(
        isLoggedin,
        authorizedRole('ADMIN'),
        upload.single('thumbnail'),
        createCourse);

router.route('/:id')
    .get(isLoggedin, authorizedsubscriber, getLecturesByCourseId)
    .put(
        isLoggedin,
        authorizedRole('ADMIN'),
        updateCourse
    )
    .delete(
        isLoggedin,
        authorizedRole('ADMIN'),
        removeCourse
    )
    .post(
        isLoggedin,
        authorizedRole('ADMIN'),
        upload.single('lecture'),
        addLectureByCourseId
    );

export default router;