const {
  //   getNow,
  //   printJson,
  success,
  error,
  //   highlight,
  bgBlue,
  //   bgMagenta,
} = require('../../utils/helpers');

const authTest = (socket) => {
  // test that socket is refused if auth absent
  socket.connect();
  socket.on('connect', () => {
    console.log(bgBlue(`Negative Test:`));

    console.log(error('Negative Test failed'));
  });

  socket.on('connect_error', (err) => {
    console.log(bgBlue(`Negative Test:`));

    console.log(error('Server-side error)', err));
    console.log(success('Test Passed'));
  });
};

module.exports = {
  authTest,
};
