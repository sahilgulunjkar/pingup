# 💬 PingUp — Modern Social Media & Real-Time Chat App

PingUp is a state-of-the-art social media and messaging application. It connects people in real-time, enabling users to create rich posts, share daily stories, form connections, chat privately, and stay updated with dynamic notifications.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Core**: React 19, JavaScript (ES6+)
- **Styling**: Tailwind CSS (Glassmorphic details, responsive grids, custom transitions)
- **State Management**: Redux Toolkit (Slices for Messages, Connections, User profile)
- **Authentication**: Clerk React (`@clerk/clerk-react` for secure, zero-friction login)
- **Real-Time Subscription**: HTML5 Server-Sent Events (`EventSource`) for low-latency live messaging
- **Icons**: Lucide React

### Backend (Server)
- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose schemas for Messages, Users, Connections, Posts, Stories)
- **Auth Middleware**: Clerk Express (`@clerk/express` for token decoding and verification)
- **File Uploads**: Multer (disk storage) & ImageKit Node SDK (for cloud storage with real-time resizing and optimizations)
- **Background Jobs**: Inngest (automated event-driven background processing)

---

## 🚀 Key Features

* **Secure Authentication**: Integrated with Clerk for seamless oauth/email log-in flows.
* **Connections & Followers**: Users can follow and connect with friends, request connection approvals, and list connections dynamically.
* **Responsive Feed**: Create rich text and multi-image posts. Like and interact with posts in a fully responsive, clean, feed interface.
* **Ephemeral Stories**: Share 24-hour stories with friends.
* **Real-time Private Chat**: Peer-to-peer messaging styled with WhatsApp/iMessage aesthetics (blue outgoing bubbles aligned right, white incoming bubbles aligned left).
* **Live Notifications**: Integrated custom custom toast cards that alert users of incoming messages, edits, or deletes in real time across the entire site.
* **Auto-Scrolling Chat Feed**: Transition-locked scrolling so you are always looking at the latest message.

---

## 📂 Directory Structure

```text
Social Media App/
├── client/                 # React Frontend Application
│   ├── public/             # Static Assets
│   └── src/
│       ├── api/            # Axios endpoints configurations
│       ├── app/            # Redux store configurations
│       ├── components/     # Reusable UI (Sidebar, Postcards, StoriesBar, Notifications)
│       ├── features/       # Redux state slices (user, connections, messages)
│       └── pages/          # Layout & page views (Feed, Messages, ChatBox, Discover, Profile)
│
├── server/                 # Express backend server
│   ├── configs/            # Multer, database, and ImageKit credentials setups
│   ├── controller/         # Request handling logic (messages, users, posts, stories)
│   ├── middlewares/        # Authentication gates (protect middleware)
│   ├── models/             # Mongoose schemas (User, Message, Post, Connection, Story)
│   └── routes/             # Express routing configurations
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas (or local MongoDB instance)
- ImageKit free account
- Clerk developer dashboard account

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/sahilgulunjkar/pingup.git
cd pingup
```

### Step 2: Configure the Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `server/` using the template below:
   ```env
   # Server configuration
   PORT=4000
   FRONTEND_URL=http://localhost:5173

   # MongoDB connection
   MONGODB_URL=your_mongodb_connection_string

   # Clerk Auth credentials
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # ImageKit cloud media credentials
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

   # Inngest Background Jobs (Optional / Local Dev)
   INNGEST_EVENT_KEY=your_inngest_event_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   ```
4. Start the server:
   ```bash
   npm run dev   # Runs backend dev server on port 4000
   ```

---

### Step 3: Configure the Frontend Client
1. Open a new terminal window and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `client/` using the template below:
   ```env
   # Clerk auth public key
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

   # API Base URL
   VITE_BASE_URL=http://localhost:4000
   ```
4. Start the dev client:
   ```bash
   npm run dev   # Launches Vite dev server on port 5173
   ```

---

## 📡 API Endpoints Documentation

### User Routes (`/api/user`)
- `GET /data` — Fetch details of current logged-in user.
- `POST /update` — Edit profile picture, cover photo, name, username, and bio.
- `POST /discover` — Search for users using name, username, email, or location.
- `POST /connect/:id` — Send a friend/connection request.
- `POST /accept/:id` — Approve a pending connection request.
- `GET /connections` — Retrieve list of connected friends, followers, following, and pending requests.
- `POST /profiles` — Get user profile cards and their posts.

### Message Routes (`/api/message`)
- `GET /:userId` — Establish SSE (Server-Sent Events) event stream connection.
- `POST /send` — Send a message containing text and/or a media attachment (uses multer `"media"` upload key).
- `POST /get` — Fetch message history with a connection.
- `PUT /:id/edit` — Edit text of a message.
- `DELETE /:id/me` — Hide message for the current user.
- `DELETE /:id/everyone` — Delete message for all participants.

### Post Routes (`/api/post`)
- `POST /add` — Publish a post (supports multiple images via multer `"images"` array key).
- `GET /feed` — Fetch the home feed posts (posts from connections, followed profiles, and yourself).
- `POST /like` — Like or unlike a post.
- `DELETE /delete/:postId` — Remove a post.

---

## 🤝 Contributing
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
