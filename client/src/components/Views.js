import { Routes, Route } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import PrivateRoutes from "./PrivateRoutes";
import { useContext } from "react";
import { AccountContext } from "./AccountContext";
import Home from "./Home/Home";

const Views = () => {
  const { user } = useContext(AccountContext);
  return user.loggedIn == null ? (
    <Text>Loading ...</Text>
  ) : (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
};
export default Views;
