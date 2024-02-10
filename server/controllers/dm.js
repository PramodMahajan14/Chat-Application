const redisClient = require("../redis");

const directMessages = async (socket, message) => {
  message.from = socket.user.userid;
  const parseMessage = { ...message, from: socket.user.userid };

  const messageString = [
    parseMessage.to,
    parseMessage.from,
    parseMessage.content,
  ].join(".");

  await redisClient.lpush(`chat:${message.to}`, messageString);
  await redisClient.lpush(`chat:${message.from}`, messageString);

  socket.to(message.to).emit("dm", message);
};

module.exports = directMessages;
