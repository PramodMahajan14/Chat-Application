import React, { createContext, useContext, useEffect, useState } from "react";
import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import SideBar from "./SideBar";
import Chat from "./Chat";
import useSocketSetup from "./useSocketSetup";
import socketConn from "../../socket";
import { AccountContext } from "../AccountContext";
export const FriendContext = createContext();
export const MessagesContext = createContext();
export const SocketContext = createContext();
const Home = () => {
  const [friendList, setfriendList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [friendindex, setFriendIndex] = useState(0);
  const { user } = useContext(AccountContext);

  const [socket, setsocket] = useState(() => socketConn(user));
  useEffect(() => {
    setsocket(() => socketConn(user));
  }, [user]);
  useSocketSetup(setfriendList, setMessages);
  return (
    <FriendContext.Provider value={{ friendList, setfriendList }}>
      <SocketContext.Provider value={{ socket }}>
        <Grid
          templateColumns="repeat(10,1fr)"
          h="100vh"
          as={Tabs}
          onChange={(index) => setFriendIndex(index)}
        >
          <GridItem colSpan="3" borderRight="1px solid gray">
            <SideBar />
          </GridItem>
          <GridItem colSpan="7" maxH="100vh">
            <MessagesContext.Provider value={{ messages, setMessages }}>
              <Chat userid={friendList[friendindex]?.userid} />
            </MessagesContext.Provider>
          </GridItem>
        </Grid>
      </SocketContext.Provider>
    </FriendContext.Provider>
  );
};

export default Home;
