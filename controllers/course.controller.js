
import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

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
            new AppError('All fiels are required', 400)
        )
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: 'Dummy',
            secure_id: 'Dummy',
        }
    });

    if (!course) {
        return next(
            new AppError('Course could not created, please try again', 500)
        )
    }

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'lms'
            });
            console.log(JSON.stringify(result));
            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_id = result.secure_url;
            }
        
            fs.rm(`uploads/${req.file.filename}`);
            
        } catch (err) {
            return next(
                new AppError(err.message, 500)
            )
        }
    }

    await course.save();

    res.status(200).json({
        success: true,
        message: 'Course created successfully',
        course
    })
};

const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body          // By "set" karne se jo bhi data course me user ke dawara update ki jayegi kevel wo hi course me update ho jayegi
            },
            {
                runValidators: true
            }
        );

        if (!course) {
            return next(
                new AppError('Course with given id not exist', 500)
            )
        }

        res.status(200).json({
            success: true,
            message: "Course update successfully",
            course
        })
    } catch (err) {
        return next(
            new AppError(err.message, 500)
        )
    }
};

const removeCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return next(
                new AppError('Course with given id does not exist', 500)
            )
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        })
    } catch (err) {
        return next(
            new AppError(err.message, 500)
        )
    }
};

const addLectureByCourseId = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params;
    
        if (!title || !description) {
            return next(
                new AppError('Title and Description are required', 500)
            )
        }
    
        const course = await Course.findById(id);
    
        if (!course) {
            return next(
                new AppError('Course with given id does not exist', 500)
            )
        }
    
        const lectureData = {
            title,
            description,
            lecture: {
                public_id: "dummy",
                secure_id: "dummy"
            },
        }
    
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms',
                    chunk_size: 50000000000,
                    resource_type: "video",
                });
                // console.log(JSON.stringify(result));
                if (result) {
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_id = result.secure_url;
                }
            
                fs.rm(`uploads/${req.file.filename}`);
                
            } catch (err) {
                return next(
                    new AppError(err.message, 500)
                )
            }
        }
    
        course.lectures.push(lectureData);
    
        course.numbersOfLectures = course.lectures.length;
    
        await course.save();
    
        res.status(200).json({
            success: true,
            message: 'Lecture successfully added to the course',
            course
        })
    } catch (err) {
        return next(
            new AppError(err.message, 500)
        )
    }
};

const removeLectureFromCourse = async (req, res, next) => {
    const {courseId, lectureId} = req.query;

    console.log(courseId);
    console.log(lectureId);

    if (!courseId) {
        return next(
            new AppError('Course ID is required', 400)
        )
    }

    if (!lectureId) {
        return next(
            new AppError('Lecture ID is required', 400)
        )
    }

    const course = await Course.findById(courseId);

    if (!course) {
        return next(
            new AppError('Invalid Course ID or course dose not exist', 400)
        )
    }

    const lectures = course.lectures;

    if (!lectures) {
        return next(
            new AppError('Lectures are not found in Course', 400)
        )
    }

    const lecture = lectures.findIndex(lectureId);
}

export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureByCourseId,
    removeLectureFromCourse
};