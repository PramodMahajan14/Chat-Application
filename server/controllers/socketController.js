// const redisClient = require("../redis");

// module.exports.authorizerUser = (socket, next) => {
//   if (!socket.request.session || !socket.request.session.user) {
//     console.log("bad rquest!");
//     next(new Error("user not authorized"));
//   } else {
//     next();
//   }
// };

// module.exports.initializeUser = async (socket) => {
//   socket.user = { ...socket.request.session.user };

//   await redisClient.hset(
//     `userid:${socket.user.username}`,
//     "userid",
//     socket.use.userid
//   );

//   const friendList = await redisClient.lrange(
//     `friends:${socket.user.username}`,
//     0,
//     -1
//   );
//   console.log(friendList);
//   socket.emit("friends", friendList);
// };

// module.exports.addFriend = async (socket, friendName, callback) => {
//   if (friendName == socket.user.username) {
//     callback({ done: false, errorMsg: "Can't add yourself" });
//     return;
//   }
//   const friendUserId = await redisClient.hget(`userid:${friendName}`, "userid");
//   const currentFriendList = await redisClient.lrange(
//     `friends:${socket.user.username}`,
//     0,
//     -1
//   );
//   console.log(
//     " friendUserId : ",
//     friendUserId,
//     "/",
//     "currentFriendList:",
//     currentFriendList
//   );
//   if (!friendUserId) {
//     callback({ done: false, errorMsg: "User Not Valid" });
//     return;
//   }

//   if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
//     callback({ done: false, errorMsg: "friend alredy added" });
//     return;
//   }

//   await redisClient.lpush(`friends:${socket.user.username}`, friendName);
//   callback({ done: true });
//   return;
// };

const redisClient = require("../redis");

module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("Bad request!");
    next(new Error("Not authorized"));
  } else {
    next();
  }
};

module.exports.initializeUser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  await redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  console.log(`${socket.user.username} friends:`, friendList);
  socket.emit("friends", friendList);
};

module.exports.addFriend = async (socket, friendName, cb) => {
  if (friendName === socket.user.username) {
    cb({ done: false, errorMsg: "Cannot add self!" });
    return;
  }
  const friendUserID = await redisClient.hget(`userid:${friendName}`, "userid");
  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  if (!friendUserID) {
    cb({ done: false, errorMsg: "User doesn't exist!" });
    return;
  }
  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
    cb({ done: false, errorMsg: "Friend already added!" });
    return;
  }

  await redisClient.lpush(`friends:${socket.user.username}`, friendName);
  cb({ done: true });
};