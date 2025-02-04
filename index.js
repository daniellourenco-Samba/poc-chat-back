const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors:{origin:"*"}});
const port = 3000;

const restrictedWords = ['palavrão', 'droga', 'merda'];

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('disconnect', (reason) => {
        console.log('user disconnected', socket.id);
    });

    socket.on('set_username', (name) => {
        console.log('set_username', name);
        socket.data.username = name;
    });

    socket.on('message', (message) => {
        if (restrictedWords.some(word => message.includes(word))) {
            return;
        }
        io.emit('receive_message', { message, authorId: socket.id, author: socket.data.username });
    });

    socket.on('kick', (socketIdToExpel) => {
        for (const connectedSocket of io.sockets.sockets.values()) {
            if (connectedSocket.id === socketIdToExpel) {
              connectedSocket.emit('kick', socketIdToExpel);
              connectedSocket.disconnect(true);
              break; 
            }
          }
      });
});




server.listen(port, () => {
    console.log(`listening on *:${port}`);
}   );