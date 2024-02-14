import { useNavigate } from "react-router";

const { createContext, useState, useEffect } = require("react");

export const AccountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    loggedIn: null,
    token: localStorage.getItem("token"),
  });

  const navigate = useNavigate();
  useEffect(() => {
    // fetch("http://localhost:4000/auth/login", {
    //   credentials: "include",
    // })
    //   .catch((err) => {
    //     setUser({ loggedIn: false });
    //     return;
    //   })
    //   .then((r) => {
    //     if (!r || !r.ok || r.status >= 400) {
    //       setUser({ loggedIn: false });
    //       return;
    //     }
    //     return r.json();
    //   })
    //   .then((data) => {
    //     if (!data) {
    //       setUser({ loggedIn: false });
    //       return;
    //     }
    //     console.log("session data: ", data);
    //     setUser({ ...data });
    //     navigate("/home");
    //   });
    loginUser();
  }, []);

  const loginUser = async () => {
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        credentials: "include",
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("session data: ", data);
      setUser({ ...data });
      navigate("/home");
    } catch (error) {
      console.error("Fetch error:", error);
      setUser({ loggedIn: false });
      return;
    }
  };
  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
