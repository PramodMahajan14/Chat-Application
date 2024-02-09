import React, { createContext, useState } from "react";
import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import SideBar from "./SideBar";
import Chat from "./Chat";
import useSocketSetup from "./useSocketSetup";

export const FriendContext = createContext();
const Home = () => {
  const [friendList, setfriendList] = useState([]);
  useSocketSetup(friendList);
  return (
    <FriendContext.Provider value={{ friendList, setfriendList }}>
      <Grid templateColumns="repeat(10,1fr)" h="100vh" as={Tabs}>
        <GridItem colSpan="3" borderRight="1px solid gray">
          <SideBar />
        </GridItem>
        <GridItem colSpan="7">
          <Chat />
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
