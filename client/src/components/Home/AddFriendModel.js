import React, { useCallback, useState, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
} from "@chakra-ui/react";
import * as Yup from "yup";
import TextField from "../TextField";
import { Form, Formik } from "formik";
import socket from "../../socket";
import { FriendContext, SocketContext } from "./Home";
const AddFriendModel = ({ isOpen, onClose }) => {
  const [err, seterr] = useState("");
  const closeModal = useCallback(() => {
    seterr("");
    onClose();
  }, [onclose]);
  const { setfriendList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Friend</ModalHeader>
          <Formik
            initialValues={{ friendName: "" }}
            validationSchema={Yup.object({
              friendName: Yup.string()
                .required("Username required !")
                .min(6, "Username too short !")
                .max(28, "Username too long"),
            })}
            onSubmit={(value) => {
              socket.emit(
                "add_friend",
                value.friendName,
                ({ errorMsg, done, newFriend }) => {
                  if (done) {
                    setfriendList((c) => [newFriend, ...c]);
                    closeModal();
                    return;
                  }
                  seterr(errorMsg);
                }
              );
            }}
          >
            <Form>
              <ModalCloseButton />
              <ModalBody>
                <Heading
                  as="p"
                  color="red.500"
                  textAlign="center"
                  fontSize="xl"
                >
                  {err}
                </Heading>
                <TextField
                  label="Enter friend's username"
                  autoComplet="off"
                  name="friendName"
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Submit
                </Button>
              </ModalFooter>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddFriendModel;
