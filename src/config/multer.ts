// import multer from "multer";
// // import path from path;
// import { v4 as uuidv4 } from "uuid";

// //1. Storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         cb(null, `${uuidv4()}${ext}`);
//     }
// });

// //2. File filter (allow images only)
// const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only image files are allowed!"));
//     }
// };

// //3. Multer upload instance
// export const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });