import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    _email: {type: String, required: true},
    full_name: {type: String, required: true},
    username: {type: String, unique: true, required: true},
    bio: {type: String, default: "Hey there I'm using PingUp!"},
    profile_picture: {type: String, default: ''},
    cover_photo: {type: String, default: ''},
    location: {type: String, default: ''},
    followers: {type: Array, ref: 'User', default: []},
    following: {type: Array, ref: 'User', default: []},
    connections: {type: Array, ref: 'User', default: []},
},{timestamps: true, minimize: false})

const User = mongoose.model('User', userSchema)

export default User