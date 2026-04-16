import User from "../models/User.js"
import client from "../configs/imageKit.js"
import Connection from "../models/Connection.js"
import fs from "fs"
import { clerkClient } from "@clerk/express"

// Get user data using userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        let user = await User.findById(userId);

        if (!user) {
            // sync user from clerk if not found in database (local development or webhook failure)
            const clerkUser = await clerkClient.users.getUser(userId)

            let username = clerkUser.emailAddresses[0].emailAddress.split('@')[0]
            const userExists = await User.findOne({ username })

            if (userExists) {
                username = username + Math.floor(Math.random() * 10_000)
            }

            const userData = {
                _id: clerkUser.id,
                email: clerkUser.emailAddresses[0].emailAddress,
                full_name: clerkUser.firstName + " " + clerkUser.lastName,
                profile_picture: clerkUser.imageUrl,
                username,
            }

            user = await User.create(userData)
        }
        res.json({ success: true, user })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Update user data using userId
export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        let { username, bio, location, full_name } = req.body;

        const tempUser = await User.findById(userId)
        let newUsername = username || tempUser.username;

        if (tempUser.username !== newUsername) {
            const userExists = await User.findOne({ username: newUsername })
            if (userExists) {
                newUsername = tempUser.username
            }
        }

        let updatedData = {
            username: newUsername,
            bio,
            location,
            full_name
        }

        // 1. FIX: Check field names carefully
        let profile_picture_file = req.files?.find(f => f.fieldname === 'profile_picture');
        // Your log showed 'cover', so we check for both to be safe
        let cover_photo_file = req.files?.find(f => f.fieldname === 'cover_photo' || f.fieldname === 'cover');

        // Handle Profile Picture
        if (profile_picture_file && fs.existsSync(profile_picture_file.path)) {
            const buffer = fs.readFileSync(profile_picture_file.path);
            
            const response = await client.files.upload({
                file: buffer, // This must be the Buffer
                fileName: profile_picture_file.originalname,
            });

            updatedData.profile_picture = client.url({
                path: response.filePath,
                transformation: [
                    { width: "512" },
                    { quality: "auto" },
                    { format: "webp" }
                ]
            });
        }

        // Handle Cover Photo
        if (cover_photo_file && fs.existsSync(cover_photo_file.path)) {
            const buffer = fs.readFileSync(cover_photo_file.path);
            
            const response = await client.files.upload({
                file: buffer, 
                fileName: cover_photo_file.originalname,
            });

            updatedData.cover_photo = client.url({
                path: response.filePath,
                transformation: [
                    { width: 1280 },
                    { quality: "auto" },
                    { format: "webp" }
                ]
            });
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        res.json({ success: true, message: "Profile updated successfully", user });
        
    } catch (error) {
        console.error("Update Error:", error);
        res.json({ success: false, message: error.message });
    }
}

// Find user using username, email location or name
export const discoverUser = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { input } = req.body;

        const allUsers = await User.find(
            {
                $or: [
                    { username: new RegExp(input, 'i') },
                    { email: new RegExp(input, 'i') },
                    { full_name: new RegExp(input, 'i') },
                    { location: new RegExp(input, 'i') },
                ]
            }
        )

        const filterUsers = allUsers.filter(user => user._id !== userId)

        res.json({ success: true, users: filterUsers })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// follow user
export const followUser = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.params;

        const user = await User.findById(userId);

        if (user.following.includes(id)) {
            return res.json({ success: false, message: "You are already following this user" })
        }

        const userToFollow = await User.findById(id);

        if (!userToFollow) {
            return res.json({ success: false, message: "User not found" })
        }

        user.following.push(id);
        userToFollow.followers.push(userId);

        await user.save();
        await userToFollow.save();

        res.json({ success: true, message: "User followed successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Unfollow user
export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.params;

        const user = await User.findById(userId);

        if (!user.following.includes(id)) {
            return res.json({ success: false, message: "You are not following this user" })
        }

        const userToUnfollow = await User.findById(id);

        if (!userToUnfollow) {
            return res.json({ success: false, message: "User not found" })
        }

        user.following = user.following.filter(followingId => followingId !== id);
        userToUnfollow.followers = userToUnfollow.followers.filter(followerId => followerId !== userId);

        await user.save();
        await userToUnfollow.save();

        res.json({ success: true, message: "User unfollowed successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Send connection request 
export const sendConnectionRequest = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { id } = req.params;

        // 1. Prevent self-connection
        if (userId === id) {
            return res.json({ success: false, message: "You cannot connect with yourself" });
        }

        // 2. Rate limiting: Check if more than 20 requests in last 24 hours
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const count = await Connection.countDocuments({
            from_user_id: userId,
            createdAt: { $gte: last24Hours }
        });

        if (count >= 20) {
            return res.json({ success: false, message: "Daily limit reached (20 requests)" });
        }

        // 3. Check for any existing relationship (sent or received)
        const existingConnection = await Connection.findOne({
            $or: [
                { from_user_id: userId, to_user_id: id },
                { from_user_id: id, to_user_id: userId }
            ]
        });

        if (existingConnection) {
            return res.json({ 
                success: false, 
                message: "A request is already pending or you are already connected" 
            });
        }

        // 4. Create request
        const connection = new Connection({
            from_user_id: userId,
            to_user_id: id,
            status: "pending"
        });

        await connection.save();
        
        // Trigger Inngest event for connection reminder
        const { inngest } = await import("../inngest/index.js")
        await inngest.send({
            name: "connection:request",
            data: { connectionId: connection._id }
        })

        res.json({ success: true, message: "Connection request sent" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get user conection Request
export const getuserConnections = async (req, res) => {
    try {
        const {userId} = req.auth()
        const user =  await User.findById(userId).populate('connections followers following')
        
        const connections = user.connections
        const followers = user.followers
        const following = user.following

        const pendingConnectionsRequest = await Connection.find({to_user_id: userId, status: 'pending'}).populate('from_user_id')
        const pendingConnections = pendingConnectionsRequest.map(connection=>connection.from_user_id)

        res.json({success: true, connections, followers, following, pendingConnections})

    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }    
};

// Accept conection Request
export const acceptConnectionRequest = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {id} = req.params

        const connection = await Connection.findOne({from_user_id: id, to_user_id: userId})

        if(!connection) {
            return res.json({success: false, message: "Connection not found"})
        }

        const user = await User.findById(userId)
        user.connections.push(id)
        await user.save()

        const toUser = await User.findById(id)
        toUser.connections.push(userId)
        await toUser.save()

        connection.status = "accepted"
        await connection.save()

        res.json({success: true, message: "Connection accepted successfully"})
    } catch(error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }    
};