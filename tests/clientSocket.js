const UNIT_TEST = 1;

const SHOW = 0;
const socket = require('./socket.js');
const { authTest } = require('./unit/Negative.js');
const {
  getNow,
  printJson,
  success,
  error,
  warn,
  highlight,
  bgBlue,
  bgMagenta,
} = require('../utils/helpers');

console.log(highlight(getNow(), ': Starting socket.js'));
console.log(UNIT_TEST ? bgBlue('Running Unit Tests') : bgMagenta('Production'));

function OpenVisitorConnection(visitor) {
  try {
    const connectionMap = new Map();
    socket.auth = { visitor };
    socket.connect();

    // these are the sockets options in the Visitor.vue
    socket.on('connect', () => {
      connectionMap.set(socket.auth, socket);
      console.groupCollapsed(`[${getNow()}] OpenVisitorConnection results:`);
      console.log(
        success(
          `On ${getNow()}, ${printJson(socket.auth)} is on socket ${socket.id}`
        )
      );
      console.groupEnd();
    });

    socket.on('connect_error', (err) => {
      if (err.message === 'invalid username') {
        this.usernameAlreadySelected = false;
      }
    });

    // socket.once('connect_error', (message) => {
    //   switch (message.type) {
    //     case 'TransportError':
    //         console.log(
    //           warn(
    //             `${
    //               socket.query.room || socket.query.visitor
    //             } attempted to connect...`
    //           )
    //         );
    //         console.log(
    //           error(
    //             '...but LCT Socket.io Server may have gone down at or before',
    //             getNow()
    //           )
    //         );
    //       }
    //       break;
    //   }
    // });

    // TODO: move these event handler details to listeners pattern
    // I believe action is necessary here only if the query options have to change (which they don't)
    socket.on('reconnect_attempt', () => {
      if (SHOW) {
        console.log(warn(`Attempting to reconnect socket:`));
        console.table(socket.io.opts.query);
      }
      // let x = visitor.filter(
      //   (v) =>
      //     (v.name == socket.io.opts.query.visitor) |
      //     socket.io.opts.query.room
      // );
      // socket.io.opts.query = x;
    });

    return socket;
  } catch (err) {
    console.log(error('Cannot find the socket.io server.'));
  }
}

if (UNIT_TEST) {
  console.log('1)');
  authTest(socket);
  console.log(' ');

  // console.log('2)');
  // OpenVisitorConnection('mpc');
}

module.exports = {
  OpenVisitorConnection,
};
