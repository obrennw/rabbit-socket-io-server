const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
// const axios = require("axios");
const amqp = require('amqplib/callback_api');

// const port = process.env.PORT || 4001;
const port = 4001;
const index = require("./routes/index");
const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);
// const rabbitMq = amqp.createConnection({url: "amqp://guest:guest@localhost:5672"});


// rabbitMq.on('ready', function () {
//    console.log("RABBIT MQ READY");
//     io.sockets.on('connection', function (socket) {
//       var queue = q = connection.queue('flink-out', {durable: true, autoDelete:false}); 
 
//        queue.bind('#'); // all messages
 
//        queue.subscribe(function (message) {
//           console.log("sent message");
//           socket.emit('values', message);
//        });
//     });
//  });
amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'flink-out';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
      io.emit('values', msg.content.toString());
    }, {noAck: true});
  });
});


server.listen(port, () => console.log(`Listening on port ${port}`))