const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user to their room based on user ID
    socket.on('join-user', (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined room: user-${userId}`);
    });

    // Handle chat messages
    socket.on('send-message', (data) => {
      const { receiverId, message, senderId } = data;
      
      // Send message to receiver
      io.to(`user-${receiverId}`).emit('new-message', {
        senderId,
        message,
        timestamp: new Date().toISOString()
      });

      // Send confirmation to sender
      socket.emit('message-sent', {
        message,
        timestamp: new Date().toISOString()
      });
    });

    // Handle job application notifications
    socket.on('job-application', (data) => {
      const { contractorId, jobTitle, labourerName } = data;
      
      io.to(`user-${contractorId}`).emit('new-application', {
        jobTitle,
        labourerName,
        timestamp: new Date().toISOString()
      });
    });

    // Handle application status updates
    socket.on('application-update', (data) => {
      const { labourerId, jobTitle, status } = data;
      
      io.to(`user-${labourerId}`).emit('application-status-update', {
        jobTitle,
        status,
        timestamp: new Date().toISOString()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
