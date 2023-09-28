import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name Is required"],
        minLength: [3, "Name must be 8 char."],
        maxLength: [15, 'Name should be less than 60 characters'],
    },
    email: {
        type: "String",
        required: [true, "E-mail is required"],
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        minLength: [8, 'Message must be atleast 8 characters'],
        maxLength: [200, 'Message should be less than 200 characters'],
    }
})

const Contact = model("Contact", contactSchema);

export default Contact;