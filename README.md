Welcome to our Learning Management System (LMS) backend repository! This repository contains the backend codebase for our LMS platform, providing RESTful APIs for authentication and authorization. We have implemented robust functionalities to handle user registration, login, logout, password management, profile retrieval, and user updates. Additionally, we have implemented an authorization system that allows only administrators to manage courses and lectures. To enhance the user experience, we have integrated Razorpay as a payment gateway for secure transactions.

# Tech Stack:
**•	Express.js:** A fast, minimal, and flexible web application framework for Node.js.

**•	MongoDB:** A NoSQL database for storing and managing our application's data.

**•	Razorpay:** A payment gateway for secure and seamless transactions.

**•	Nodemon:** A utility to monitor changes and automatically restart the server during development.

**•	Nodemailer:** A module to send emails for various functionalities like password reset.

**•	Multer:** Middleware for handling multipart/form-data, used for uploading files like profile pictures.

**•	Morgan:** A logger middleware for HTTP requests, aiding in debugging and monitoring.

**•	Mongoose:** A powerful library for MongoDB object modeling and data validation.

**•	Jsonwebtoken:** For implementing JSON web tokens (JWT) for user authentication and authorization.

**•	Email-validator:** A module to validate email addresses for user registration and password reset.

**•	Dotenv:** A module for managing environment variables.

**•	Cors:** Middleware to enable Cross-Origin Resource Sharing and manage CORS policies.

**•	Cookie-parser:** Middleware to handle HTTP cookies in the application.

**•	Cloudinary:** A cloud-based image and video management service for profile picture storage.

**•	Bcrypt:** For secure hashing of passwords to protect user credentials.

# Implemented Routes and Controllers:

## Authentication:
**•	Register:** POST request to create a new user account.

**•	Login:** POST request to authenticate and log in the user.

**•	Logout:** POST request to invalidate the user session and log out.

**•	Reset Password:** POST request to reset the user's password.

**•	Update User:** PUT request to update user information.

**•	Change Password:** PUT request to change the user's password.

**•	Get Profile:** GET request to retrieve the user's profile information.

## Authorization:

Only admin users are authorized to access the following APIs:

**•	Add Course**: POST request to create a new course.

**•	Edit Course**: PUT request to update an existing course.

**•	Update Course:** PATCH request to modify specific attributes of a course.

**•	Add Lecture:** POST request to add a new lecture to a course.

**•	Edit Lecture:** PUT request to update an existing lecture.

**•	Update Lecture:** PATCH request to modify specific attributes of a lecture.

Database and Pointer: We are using MongoDB as our database to store and manage our application's data. Pointers to MongoDB collections are used in the Mongoose models to establish relationships between various entities, such as users, courses, and lectures.

This LMS backend provides a secure and scalable solution for user management, authentication, and authorization. It ensures smooth communication with the frontend and allows seamless integration of payment functionalities through Razorpay. Our stack includes several popular and reliable libraries and packages, making the development process efficient and robust.

