import {
  VStack,
  ButtonGroup,
  Button,
  Heading,
  Text,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import TextField from "../TextField";
import { useContext } from "react";
import useSocketSetup from "../Home/useSocketSetup";
import { AccountContext } from "../AccountContext";
const Login = () => {
  // useSocketSetup();
  const { setUser } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false);
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
        setloading(true);
        const vals = { ...values };
        fetch("http://localhost:4000/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify(vals),
        })
          .catch((err) => {
            setError(err);
            console.log("error ==> ", err.status);
            setloading(false);
            setTimeout(() => {
              setError("");
            }, 3000);
            return;
          })
          .then((res) => res.json())
          .then((data) => {
            setloading(false);
            console.log(data);
            if (!data) return;

            setUser({ ...data });
            console.log("login response: => ", data);
            if (data.status) {
              setError(data.status);
            } else if (data.loggedIn) {
              setloading(false);
              navigate("/home");
            }
          })
          .catch((error) => {
            setloading(false);
            console.error("Error:", error);
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
          <Heading>Log In</Heading>
          <Text color="red.500">{error}</Text>
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
              {loading ? (
                <CircularProgress
                  isIndeterminate
                  color="orange.400"
                  size="30px"
                />
              ) : (
                "Login"
              )}
            </Button>
            <Button onClick={() => navigate("/register")}>
              Create Account
            </Button>
          </ButtonGroup>
        </VStack>
      )}
    </Formik>
  );
};
export default Login;

// initialValues={{ username: "", password: "" }}
// validationSchema={Yup.object({
//   username: Yup.string()
//     .required("Username required !")
//     .min(6, "Username too short !")
//     .max(28, "Username too long"),
//   password: Yup.string()
//     .required("Password required !")
//     .min(6, "Password too short !")
//     .max(28, "Password too long"),
// })}
// onSubmit={(values, actions) => {
//   const vals = { ...values };
//   fetch("http://localhost:4000/auth/login", {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "Application/json",
//     },
//     body: JSON.stringify(vals),
//   })
//     .catch((err) => {
//       console.log(err);
//       return;
//     })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data);
//       if (!data) return;

//       setUser({ ...data });
//       if (data.status) {
//         setError(data.status);
//       } else if (data.loggedIn) {
//         navigate("/home");
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });

//   actions.resetForm();
// }}
// >
// {(formik) => (

// )}
