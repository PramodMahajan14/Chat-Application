import { VStack, ButtonGroup, Button, Heading, Text } from "@chakra-ui/react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import TextField from "../TextField";
import { useNavigate } from "react-router";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import { AccountContext } from "../AccountContext";

const Signup = () => {
  const { setUser } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string()
          .required("Username required !")
          .min(6, "Username too short !")
          .max(28, "Username too long"),
        password: Yup.string()
          .required("Password required !")
          .min(6, "Password too short !")
          .max(28, "Password too long"),
      })}
      onSubmit={(values, actions) => {
        const vals = { ...values };
        fetch("http://localhost:4000/auth//singup", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify(vals),
        })
          .catch((err) => {
            console.log(err);
            return;
          })
          .then((res) => {
            if (!res || !res.ok || res.status >= 400) return;
            return res.json;
          })
          .then((data) => {
            if (!data) return;
            setUser({ ...data });

            if (data.status) {
              setError(data.status);
            } else if (data.loggedIn) {
              localStorage.setItem("token", data.token);
              navigate("/home");
            }
          });
        actions.resetForm();
      }}
    >
      {(formik) => (
        <VStack
          as={Form}
          w={{ base: "90%", md: "500px" }}
          m="auto"
          justify="center"
          h="100vh"
          spacing="1rem"
          onSubmit={formik.handleSubmit}
        >
          <Heading>Sign Up</Heading>
          <Text as="p" color="red.500">
            {error}
          </Text>
          <TextField
            name="username"
            placeholder="Enter username"
            autoComplete="off"
            label="UserName"
          />
          <TextField
            name="password"
            placeholder="Enter password"
            autoComplete="off"
            label="Password"
            type="password"
          />

          <ButtonGroup>
            <Button colorScheme="teal" type="submit">
              Create Account
            </Button>
            <Button onClick={() => navigate("/")} leftIcon={<ArrowBackIcon />}>
              SignIn
            </Button>
          </ButtonGroup>
        </VStack>
      )}
    </Formik>
  );
};
export default Signup;
