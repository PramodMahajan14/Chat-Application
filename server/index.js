require("dotenv").config();
const express = require("express");

const { Server } = require("socket.io");
const app = express();
const {
  sessionMiddleware,
  wrap,
  corsConfig,
} = require("./controllers/serverController");
const helmet = require("helmet");
const cors = require("cors");
const authrouter = require("./routers/authrouter");
const directMessages = require("./controllers/dm");

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: corsConfig,
});
const {
  authorizerUser,
  initializeUser,
  addFriend,
  onDisconnect,
} = require("./controllers/socketController");

app.use(helmet());
app.use(express.json());
app.use(sessionMiddleware);
app.use(cors(corsConfig));

app.get("/", (req, res) => {
  res.json("hiiS");
});
app.use("/auth", authrouter);

io.use(wrap(sessionMiddleware));
io.use(authorizerUser);
io.on("connect", (socket) => {
  initializeUser(socket);

  socket.on("add_friend", (friendName, cb) => {
    addFriend(socket, friendName, cb);
  });

  socket.on("dm", (message) => {
    directMessages(socket, message);
  });

  socket.on("disconnecting", () => onDisconnect(socket));
});

server.listen(process.env.SERVER_PORT, () => {
  console.log("server li");
});
