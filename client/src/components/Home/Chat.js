import React, { useContext } from "react";
import { VStack, Text } from "@chakra-ui/layout";
import { TabPanel, TabPanels } from "@chakra-ui/tabs";
import { FriendContext } from "./Home";
const Chat = () => {
  const { friendList } = useContext(FriendContext);
  return friendList.length > 0 ? (
    <VStack>
      <TabPanels>
        <TabPanel>Freind One</TabPanel>
        <TabPanel>Freind One</TabPanel>
      </TabPanels>
    </VStack>
  ) : (
    <VStack
      justifyContent="center"
      w="100%"
      pt="5rem"
      textAlign="center"
      fontSize="lg"
    >
      <TabPanels>
        <Text>No Friend ☹️ Click add friend to chatting</Text>
      </TabPanels>
    </VStack>
  );
};
export default Chat;
