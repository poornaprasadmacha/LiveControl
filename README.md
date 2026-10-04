# LiveControl

> **Control the room. Engage everyone.**

LiveControl is a production-quality, real-time presentation and live quiz control platform where one administrator authoritatively controls what every connected audience member sees in real time without refreshing.

---

## 🌟 Key Features

### Mode A: Live Presentation
- **Authoritative Server Sync**: Host controls slide progression (Next, Previous, Jump to Slide, First/Last).
- **Instant Audience View**: Viewers cannot manually navigate slides; server state guarantees sync across all connected clients.
- **Blank Screen Toggle**: Host can blank/resume the presentation screen at any moment.
- **Keyboard Shortcuts**: Host controls with arrow keys, Space, Home, End, `B` (Blank Screen), and `F` (Fullscreen).

### Mode B: Live Quiz
- **Participant Nickname Joining**: Simple join flow with input validation (2–20 characters, duplicate protection).
- **Host Control Flow**: Start quiz, navigate questions, open/close answer submissions, reveal correct answers, and trigger live leaderboards.
- **Live Response Monitoring**: Real-time response counts and option distribution visible on host dashboard.
- **Server-Side Scoring**: Authoritative scoring preventing client-side score manipulation.
- **CSV Data Export**: Download complete quiz results (`Nickname, Score, Correct Answers, Wrong Answers, Questions Answered`) before deleting sessions.

---

## 🏗️ System Architecture

```text
                    GitHub Repository
                           |
             ---------------------------------
             |                               |
        Vercel Host                     Render Host
             |                               |
     Next.js Frontend                Node.js Backend
   (React, TypeScript)             (Express, Socket.IO)
                                             |
                                    In-Memory Room Store
```

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Canvas-Confetti.
- **Backend**: Node.js, Express, Socket.IO.
- **Storage**: Clean Service Abstraction (`IRoomStore`, `MemoryRoomStore`, `SessionStore`). No database for V1.

---

## ⚠️ Important Server Memory Warning

This version of LiveControl stores active room state in **Node.js server memory** to maintain extreme simplicity and low latency:

1. **Host Browser Disconnection**: When the administrator closes their browser accidentally, the room **remains active in server memory**. When the host opens the admin URL and authenticates with their PIN, they resume full control.
2. **Explicit Deletion**: Clicking **END & DELETE SESSION** permanently removes session data from server memory and disconnects all viewers.
3. **Server Restart Limitation**: If the Node.js backend server restarts (e.g. host deployment restart or cold spin-up), active room memory is cleared.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/livecontrol.git
cd livecontrol
npm install
```

### 2. Configure Environment Variables

Create `.env` based on `.env.example`:

```env
ADMIN_PIN=admin123
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:3001
ROOM_EXPIRATION_MINUTES=120
AUTO_DELETE_ENABLED=true
```

### 3. Run Development Server

Run both Next.js frontend and Express/Socket.IO backend concurrently:

```bash
npm run dev
```

Or run services individually:

```bash
# Terminal 1: Next.js Frontend (Port 3000)
npm run dev:frontend

# Terminal 2: Socket.IO Backend (Port 3001)
npm run dev:backend
```

Open `http://localhost:3000` in your browser. Try `/demo` to test host and viewer tabs side by side.

---

## 🚢 Deployment Guide

### Deploying Frontend to Vercel

1. Import the repository into Vercel.
2. Add Environment Variable:
   - `NEXT_PUBLIC_SOCKET_SERVER_URL`: `https://your-backend.onrender.com`
3. Deploy.

### Deploying Backend to Render

1. Create a **Web Service** on Render pointing to your repository.
2. Build Command: `npm run build:backend`
3. Start Command: `npm run start:backend`
4. Environment Variables:
   - `ADMIN_PIN`: `your-secure-admin-pin`
   - `FRONTEND_URL`: `https://your-app.vercel.app`
   - `ROOM_EXPIRATION_MINUTES`: `120`
   - `AUTO_DELETE_ENABLED`: `true`
5. Deploy.

### Custom Domain Configuration

If using custom domains (e.g., `livecontrol.example.com` and `backend.example.com`):
- Update `FRONTEND_URL` in backend environment variables.
- Update `NEXT_PUBLIC_SOCKET_SERVER_URL` in frontend environment variables.

---

## 🔒 Security Features

- **Server-Side PIN Verification**: Host authorization checked server-side using secure tokens.
- **PIN Rate Limiting**: Max 5 failed attempts per IP before temporary 5-minute lockout.
- **No Client Role Trust**: Clients cannot upgrade roles or issue unauthorized control commands via Socket.IO.
- **No Early Answer Exposure**: Correct answers are only sent to clients after the host explicitly clicks "Show Results".

---

## 🗺️ Roadmap & Future Database Integration

The architecture uses an abstract `IRoomStore` interface. Future releases can plug in:
- `RedisRoomStore`: Distributed in-memory storage for multi-instance horizontal scaling.
- `PostgresRoomStore`: Persistent storage for saved slide decks, historical quiz reports, and user accounts.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
