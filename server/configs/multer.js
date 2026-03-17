import multer from "multer";

// This file will handle file uploads
const storage = multer.diskStorage({})

export const upload = multer({storage})