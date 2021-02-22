const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:8081',
  },
});
const { getNow, printJson } = require('../utils/helpers');

const crypto = require('crypto');
const randomId = () => crypto.randomBytes(8).toString('hex');

const { InMemorySessionStore } = require('./sessionStore');
const sessionStore = new InMemorySessionStore();

// Socket.io V3 no longer uses the query string for things like this
//see <https://socket.io/docs/v3/migrating-from-2-x-to-3-0/#Add-a-clear-distinction-between-the-Manager-query-option-and-the-Socket-query-option>:
// const base64id = require('base64id');
// const URL = require('url').URL;
// io.engine.generateId = (req) => {
//   const myURL = new URL(req.url);
//   const prevId = myURL.searchParams.get('id');
//   console.log(prevId);
//   const parsedUrl = new url.parse(req.url);
//   const params = new URLSearchParams(parsedUrl.search);
//   const prevId = params.get("id");
//   // prevId is either a valid id or an empty string
//   if (!prevId) {
//     return prevId;
//   }
//   return base64id.generateId();
// };

// const url = require("url");

io.use((socket, next) => {
  console.log('io.use():', getNow(), socket.id, printJson(socket.handshake));
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.visitor = session.visitor;
      return next();
    }
  }
  const visitor = socket.handshake.auth.visitor;
  if (!visitor) {
    return next(new Error('invalid visitor'));
  }
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.visitor = visitor;
  next();
});

io.on('connection', (socket) => {
  // persist session
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    visitor: socket.visitor,
    connected: true,
  });

  // emit session details
  socket.emit('session', {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });

  // join the "userID" room
  socket.join(socket.userID);

  // fetch existing users
  const users = [];
  sessionStore.findAllSessions().forEach((session) => {
    users.push({
      userID: session.userID,
      visitor: session.visitor,
      connected: session.connected,
    });
  });
  socket.emit('users', users);

  // notify existing users
  socket.broadcast.emit('user connected', {
    userID: socket.userID,
    visitor: socket.visitor,
    connected: true,
  });

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on('private message', ({ content, to }) => {
    socket.to(to).to(socket.userID).emit('private message', {
      content,
      from: socket.userID,
      to,
    });
  });

  // notify users upon disconnection
  socket.on('disconnect', async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit('user disconnected', socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        visitor: socket.visitor,
        connected: false,
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
