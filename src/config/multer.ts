import multer from "multer";

const storage = multer.memoryStorage();

// Allow ALL file types
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});
