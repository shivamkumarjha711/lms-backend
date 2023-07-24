import AppError from "../utils/error.util.js";
import  Jwt  from "jsonwebtoken";

const isLoggedin = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new AppError('Unauthenticated, please login again', 400));
    }

    const userDetails = await Jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;

    next();

}

export {
    isLoggedin
};