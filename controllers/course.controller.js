
import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";

const getAllCourses = async function(req, res, next) {
    try {
        const courses = await Course.find({}).select('-lectures');

        res.status(200).json({
            success: true,
            message: 'All courses',
            courses,
        })

    } catch (err) {
        return next(new AppError(err.message, 400));
    }
};

const getLecturesByCourseId = async function(req, res, next) {
    try {
        const { id } = req.params;      // Fetch id from params(URL)    Note: params se hum URL se data fetch karte hai

        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError('Course not found, Invalid course Id', 400));
        }

        res.status(200).json({
            success: true,
            message: "Course lectures fetched successfully",
            lectures: course.lectures
        })
    } catch (err) {
        return next(new AppError(err.message, 400));
    }
};

const createCourse = async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
        return next(
            
        )
    }
};

const updateCourse = async (req, res, next) => {

};

const removeCourse = async (req, res, next) {

}

export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse
};