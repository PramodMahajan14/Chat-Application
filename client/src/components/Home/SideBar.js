import React, { useContext } from "react";
import { Button } from "@chakra-ui/button";
import { ChatIcon } from "@chakra-ui/icons";
import {
  VStack,
  HStack,
  Heading,
  Divider,
  Text,
  Circle,
} from "@chakra-ui/layout";
import { Tabs, TabList } from "@chakra-ui/tabs";
import { useDisclosure } from "@chakra-ui/react";
import { FriendContext } from "./Home";
import AddFriendModel from "./AddFriendModel";

const SideBar = () => {
  const { friendList } = useContext(FriendContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <VStack py="1.4rem">
        <HStack>
          <Heading size="md" justifyContent="space-evenly" w="100%">
            {" "}
            Add Friends
          </Heading>
          <Button onClick={onOpen}>
            {" "}
            <ChatIcon />
          </Button>
        </HStack>
        <Divider />
        <VStack as={TabList}>
          {friendList.map((friend) => {
            return (
              <HStack as={Tabs}>
                {" "}
                key={`friend:${friend}`}
                <Circle
                  bg={friend.connected ? "green.500" : "red.500"}
                  w="20px"
                  h="20px"
                />
                <Text>{friend.username}</Text>
              </HStack>
            );
          })}
        </VStack>
      </VStack>
      <AddFriendModel isOpen={isOpen} onClose={onClose} />
    </>
  );
};
export default SideBar;
