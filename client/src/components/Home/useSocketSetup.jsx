import { useContext, useEffect } from "react";
import socket from "../../socket";
import { AccountContext } from "../AccountContext";

const useSocketSetup = (setfriendList) => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    socket.on("friends", (friends) => {
      console.log(friends);
      setfriendList(friends);
    });
    socket.on("connect_error", () => {
      console.log("connection fail");
      setUser({ loggedIn: false });
    });
    return () => {
      socket.off("connect_error");
    };
  }, [setUser, setfriendList]);
  socket.connect();
};

export default useSocketSetup;
