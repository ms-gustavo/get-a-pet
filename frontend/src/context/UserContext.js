import { createContext } from "react";

// hooks
import useAuth from "../hooks/useAuth";

const Context = createContext();

function UserProvider({ children }) {
  const { logout, authenticated, register, login } = useAuth();

  return (
    <Context.Provider value={{ logout, authenticated, register, login }}>
      {children}
    </Context.Provider>
  );
}

export { Context, UserProvider };
