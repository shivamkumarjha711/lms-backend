import User from "../models/user.model.js";
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

const authorizedRole = (...roles) => (req, res, next) => {
    const currentUserRole = req.user.role;
    if (!roles.includes(currentUserRole)) {
        return next(
            new AppError('You do not have permission to access this route', 403)
        )
    };
    next();
}

const authorizedsubscriber = async (req, res, next) => {
    const subscription = req.user.subscription;
    const currentUserRole = req.user.role;
    const user = await User.findById(req.user.id)

    if (user.role !== 'ADMIN' && user.subscription.status !== 'active') {     //  (currentUserRole !== 'ADMIN' || subscription.status !== 'active')
        return next(
            new AppError('Please subscribe to access this route!', 403)
        )
    }

    next();
};


export {
    isLoggedin,
    authorizedRole,
    authorizedsubscriber
};