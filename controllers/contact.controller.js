import AppError from "../utils/error.util.js";
import Contact from "../models/contact.model.js"

const contactForm = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return next(
                new AppError("All fields are required", 400)
            )
        }

        const contact = await Contact.create({
            name,
            email,
            message
        })

        if (!contact) {
            return next(
                new AppError("Your Detail not Saved, try Again!", 500)
            )
        }

        await contact.save();

        res.status(200).json({
            success: true,
            message: "Contact Details saved successfully",
            contact
        })
        
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
}

export {
    contactForm
};