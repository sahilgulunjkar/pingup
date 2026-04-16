import express from "express";
import { getUserData, updateUserData, discoverUser, followUser, unfollowUser, acceptConnectionRequest, getuserConnections, sendConnectionRequest } from "../controller/userController.js";
import { protect } from '../middlewares/auth.js'
import { upload } from "../configs/multer.js";

const userRouter = express.Router();

// Wrap multer to handle non-multipart requests gracefully
const handleUpload = (req, res, next) => {
    upload.any()(req, res, (err) => {
        if (err) {
            console.log("Multer error:", err);
            return next();
        }
        next();
    });
};

userRouter.get("/data", protect, getUserData)
userRouter.post("/update", protect, handleUpload, updateUserData)
userRouter.post("/discover", protect, discoverUser)
userRouter.post("/follow/:id", protect, followUser)
userRouter.post("/unfollow/:id", protect, unfollowUser)
userRouter.post("/connect/:id", protect, sendConnectionRequest)
userRouter.post("/accept/:id", protect, acceptConnectionRequest)
userRouter.get("/connections", protect, getuserConnections)

export default userRouter;