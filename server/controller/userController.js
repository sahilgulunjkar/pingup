import User from "../models/User.js"

// Get user data using userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth;
        const user = await User.findById(userId);
        if(!user) {
            return res.json({success:false, message: "user not found"})
        }
        res.json({success:true, user})
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }
}

// Update user data using userId
export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { username, bio, location, full_name } = req.body;
        
        const tempUser = await User.findById(userId)
        !username && (username = tempUser.username)

        if(tempUser.username !== username) {
            const user = await User.findOne({username})
            if(user) {
                // we will not change username if it is already taken
                username = tempUser.username
            }
        }

        const updatedData = {
            username,
            bio,
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]
        
        res.json({success:true, user})
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }
}