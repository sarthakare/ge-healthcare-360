import { createContext, useContext } from "react";

export const AuthPageContactContext = createContext(null);

export function useAuthPageContact() {
  return useContext(AuthPageContactContext);
}
