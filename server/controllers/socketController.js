const { jwtVerify } = require("../jwt/jwtAuth");
const redisClient = require("../redis");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.authorizeUser = (socket, next) => {
  const token = socket.handshake.auth.token;
  conosole.log(token);
  jwtVerify(token, process.env.JWT_SECRET)
    .then((decoded) => {
      socket.user = { ...decoded };
      next();
    })
    .catch((err) => {
      console.log("Bad request!", err);
      next(new Error("Not authorized"));
    });
};

module.exports.initializeUser = async (socket) => {
  socket.join(socket.user.userid);
  await redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid,
    "connected",
    true
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  const parsedFriendList = await parseFriendList(friendList);
  const friendRooms = parsedFriendList.map((friend) => friend.userid);

  if (friendRooms.length > 0)
    socket.to(friendRooms).emit("connected", true, socket.user.username);

  socket.emit("friends", parsedFriendList);
  const msgQuery = await redisClient.lrange(
    `chat:${socket.user.userid}`,
    0,
    -1
  );
  // to from content
  const messages = msgQuery.map((msgstr) => {
    const parseStr = msgstr.split(".");
    return { to: parseStr[0], from: parseStr[1], content: parseStr[2] };
  });

  if (messages && messages.length > 0) socket.emit("messages", messages);
};

module.exports.addFriend = async (socket, friendName, cb) => {
  if (friendName === socket.user.username) {
    cb({ done: false, errorMsg: "Cannot add self!" });
    return;
  }
  const friend = await redisClient.hgetall(`userid:${friendName}`);
  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  if (!friend) {
    cb({ done: false, errorMsg: "User doesn't exist!" });
    return;
  }
  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
    cb({ done: false, errorMsg: "Friend already added!" });
    return;
  }

  await redisClient.lpush(
    `friends:${socket.user.username}`,
    [friendName, friend.userid].join(".")
  );

  const newFriend = {
    username: friendName,
    userid: friend.userid,
    connected: friend.connected,
  };
  cb({ done: true, newFriend });
};

module.exports.onDisconnect = async (socket) => {
  await redisClient.hset(`userid:${socket.user.username}`, "connected", false);
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  const friendRooms = await parseFriendList(friendList).then((friends) =>
    friends.map((friend) => friend.userid)
  );
  socket.to(friendRooms).emit("connected", false, socket.user.username);
};

const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for (let friend of friendList) {
    const parsedFriend = friend.split(".");
    const friendConnected = await redisClient.hget(
      `userid:${parsedFriend[0]}`,
      "connected"
    );
    newFriendList.push({
      username: parsedFriend[0],
      userid: parsedFriend[1],
      connected: friendConnected,
    });
  }
  return newFriendList;
};
