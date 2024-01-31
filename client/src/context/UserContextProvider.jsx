import React, { useState } from "react";
import { createContext } from "react";

export const UserContext = createContext(null);

function UserContextProvider({ children }) {
  const [userName, setUserName] = useState("");
  const [filter, setFilter] = useState("all");
  return (
    <UserContext.Provider value={{ userName, setUserName, filter, setFilter }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
