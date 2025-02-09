# EventHub
**EventHub** is a full-stack event management platform that allows users to create, manage, and attend events effortlessly. It features user authentication, real-time updates, and an intuitive UI for a seamless experience across devices.

##  Deployment
-  **Frontend**: https://eventhub-murex.vercel.app/
-  **Backend**: https://eventhubapi.onrender.com/

##  Test Credentials
- **Email**: `testuser@gmail.com`
- **Password**: `user@1234`

## 🛠 Installation & Setup

### Clone the Repository
```bash
 git clone https://github.com/yourusername/EventHub.git
 cd EventHub
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```



## Features

### Frontend (React.js)
-  **User Authentication**: Secure login with JWT, guest login support.
-  **Event Dashboard**: View upcoming & past events, filter by category & date.
-  **Event Creation**: Create events with details like name, description, date/time.
-  **Real-Time Attendee List**: WebSocket-based live attendee count.
-  **Responsive Design**: Optimized for all devices.

### Backend (Node.js, Express.js, MongoDB)
-  **Authentication API**: Secure JWT-based authentication.
-  **Event Management API**: CRUD operations with ownership restrictions.
-  **Real-Time Updates**: Implemented using WebSockets (Socket.io).
-  **Database**: Stores user and event data efficiently using MongoDB Atlas.

