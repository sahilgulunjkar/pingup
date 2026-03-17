import { response } from "express";

export const protect = async (req, req, next) => {
    try {
        const {userId} = await req.auth();
        if(!userId) {
            return res.json({success:false, message: "not authenticated"})
        }
        next()
    } catch (error) {
        console.log(error);
        return res.json({success:false, message: error.message})
    }
}