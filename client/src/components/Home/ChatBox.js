import React, { useContext } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Button, Input, HStack } from "@chakra-ui/react";

import { MessagesContext, SocketContext } from "./Home";
const ChatBox = ({ userid }) => {
  const { setMessages } = useContext(MessagesContext);
  const { socket } = useContext(SocketContext);
  return (
    <Formik
      initialValues={{ message: "" }}
      validationSchema={Yup.object({
        message: Yup.string().min(1).max(255),
      })}
      onSubmit={(value, action) => {
        console.log(value.message);
        const message = { to: userid, form: null, content: value.message };
        socket.emit("dm", message);
        setMessages((prevMsg) => [message, ...prevMsg]);
        action.resetForm(JSON.stringify(message));
      }}
    >
      <HStack as={Form} w="100%" pb="1.4rem" px="1.4rem">
        <Input
          as={Field}
          name="message"
          placeholder="Type message here.."
          size="lg"
          autoComplete="off"
        />
        <Button type="submit" size="lg" colorScheme="teal">
          send
        </Button>
      </HStack>
    </Formik>
  );
};
export default ChatBox;
