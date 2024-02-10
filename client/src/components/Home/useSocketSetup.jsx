import { useContext, useEffect } from "react";
import socket from "../../socket";
import { AccountContext } from "../AccountContext";

const useSocketSetup = (setfriendList, setMessages) => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    socket.on("friends", (friendList) => {
      console.log(friendList);
      setfriendList(friendList);
    });

    socket.on("connected", (status, username) => {
      setfriendList((prevFriends) => {
        return [...prevFriends].map((friend) => {
          if (friend.username === username) {
            friend.connected = status;
          }
          return friend;
        });
      });
    });
    socket.on("messages", (messages) => {
      setMessages(messages);
    });
    socket.on("dm", (message) => {
      setMessages((prevMsg) => [message, ...prevMsg]);
    });
    socket.on("connect_error", () => {
      console.log("connection fail");
      setUser({ loggedIn: false });
    });
    return () => {
      socket.off("connect_error");
      socket.off("connected");
      socket.off("friends");
      socket.off("messages");
    };
  }, [setUser, setfriendList]);
};

export default useSocketSetup;
