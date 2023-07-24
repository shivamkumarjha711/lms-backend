
import multer from "multer";
import path from "path";


const upload = multer({            // By multer we change binary formate of image in file formate
    dest: "uploads/",           // Set Destination
    limits: { fileSize: 50 * 1024 * 1024},      // Set 50mb is max size limit ofavatar
    storage: multer.diskStorage({
        destination: "uploads/",
        filename: (_req, file, cb) => {
            cb(null, file.originalname);
        },
    }),

    fileFilter: (_req, file, cb) => {
        let ext = path.extname(file.originalname);

        if (
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".wepg" &&
            ext !== ".png" &&
            ext !== ".mp4" 
        ) {
            cb(new Error(`Unsupported file type! ${ext}`), false);
            return;
        }

        cb(null, true)
    },

});

export default upload;