import React from "react";
const mainContext = React.createContext();

export function mainProvider({ children }) {
  return <mainContext.Provider>{children}</mainContext.Provider>;
}
