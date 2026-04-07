import { Inngest } from "inngest";
import User from "../models/User.js";
import connectDB from "../configs/db.js"; 
import Connection from "../models/Connection.js";
import sendEmail from "../configs/nodemailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "pingup-app" });

// Ingest function to save user data to a database using clerk web-hooks
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },

    async ({ event }) => {
        await connectDB(); // Connect to the database first

        const { id, first_name, last_name, email_addresses, image_url } = event.data
        let username = email_addresses[0].email_address.split('@')[0]

        // check availability of username
        const user = await User.findOne({ username })

        if (user) {
            username = username + Math.floor(Math.random() * 10_000)
        }

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
            username,
        }

        await User.create(userData)
    }
)

// Ingest function to update user data to a database
const syncUserUpdation = inngest.createFunction (
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },

    async ({ event }) => {
        await connectDB(); // Connect to the database first

        const { id, first_name, last_name, email_addresses, image_url } = event.data

        const updateUserData = {
            email: email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
        }

        await User.findByIdAndUpdate(id, updateUserData)
    }
)

// Ingest function to delete user data from database
const syncUserDeletion = inngest.createFunction (
    { id: 'delete-user-from-clerk' },
    { event: 'clerk/user.deleted' },

    async ({ event }) => {
        await connectDB(); // Connect to the database first

        const { id } = event.data

        await User.findByIdAndDelete(id)
    }
)

// Inngest function to send remainder when a new connection request is added
const sendNewConnectionRequestReminder = inngest.createFunction (
    { id: "send-new-connection-request-reminder" },
    { event: "connection:request" },
    async ({ event, step }) => {
        const {connectionId} = event.data;

        await step.run("send-connection-request-email", async () => {
            const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id')
            const subject = `New connection request`
            const body = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2>Hi ${connection.to_user_id.full_name}</h2>
                <p>${connection.from_user_id.full_name} sent you a connection request</p>
                <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981; text-decoration: none;"> View connection request</a>
                <br>
                <p>Thanks, PingUp Team</p>
            </div>
            `
            
            await sendEmail({
                to: connection.to_user_id.email,
                subject,
                body
            })
        })
    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendNewConnectionRequestReminder
]