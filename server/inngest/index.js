import { Inngest } from "inngest";
import User from "../models/User.js";
import connectDB from "../configs/db.js"; 
import Connection from "../models/Connection.js";
import sendEmail from "../configs/nodemailer.js";
import Story from "../models/Story.js";

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

// Inngest function to send reminder when a new connection request is added
const sendNewConnectionRequestReminder = inngest.createFunction (
  { id: 'send-new-connection-request-reminder' },
  { event: "app/connection.request" }, 

  async ({ event, step }) => {
    await connectDB();
    
    const { connectionId } = event.data;

    await step.run("send-connection-request-mail", async () => {
      const connection = await Connection.findById(connectionId).populate('from_user_id to_user_id');
      
      if (!connection || !connection.from_user_id || !connection.to_user_id) {
        return { message: "Connection or Users no longer exist" };
      }

      const subject = "New Connection Request";
      const body = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hi ${connection.to_user_id.full_name},</h2>
        <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
        <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #10b981;">here</a> to accept or reject the request</p>
        <br/>
        <p>Thanks,<br>PingUp - Stay Connected </p>
      </div>`;
  
      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });
    });

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("wait-for-24-hours", in24Hours);

    await step.run("send-connection-request-reminder", async () => {
      const connection = await Connection.findById(connectionId).populate("from_user_id to_user_id");

      // Stop if the connection was already accepted, rejected, or deleted
      if (!connection || !connection.from_user_id || !connection.to_user_id) {
        return { message: "Connection or Users no longer exist" };
      }
      if (connection.status !== 'pending') {
        return { message: `Request is already ${connection.status}` };
      }

      const subject = "New Connection Request";
      const body = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hi ${connection.to_user_id.full_name},</h2>
        <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
        <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #10b981;">here</a> to accept or reject the request</p>
        <br/>
        <p>Thanks,<br>PingUp - Stay Connected </p>
      </div>`;
  
      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });
      
      return { message: 'Reminder sent' };
    });
  }
);

// Inngest function to delete story after 24 hours
const deleteStory = inngest.createFunction(
  { id: 'story-delete' },
  { event: 'app/story.delete' },

  async ({ event, step }) => {
    await connectDB();
    const { storyId } = event.data;
    const in24hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil('wait-for-24-hours', in24hours);
    await step.run('delete-story', async () => {
        const story = await Story.findByIdAndDelete(storyId);
        
        if (!story) {
          return { message: "Story not found" }
        }

        return { message: "Story deleted successfully" }
    })
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
    sendNewConnectionRequestReminder,
    deleteStory
]