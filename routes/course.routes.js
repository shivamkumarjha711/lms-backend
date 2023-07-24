import { Router } from "express";
import { getAllCourses, getLecturesByCourseId } from "../controllers/course.controller"

const router = new Router();

router.get('/', getAllCourses);

router.get('/:id', getLecturesByCourseId);

export default router;