import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [currentAct, setCurrentAct] = useState(1);

  function login(rmId) {
    setSession({
      rmId,
      name: "Arjun Mehta",
      initials: "AM",
      sessionStartTime: new Date().toISOString(),
    });
  }

  function logout() {
    setSession(null);
    setSelectedPortfolio(null);
    setCurrentAct(1);
  }

  return (
    <AppContext.Provider
      value={{
        session,
        login,
        logout,
        selectedPortfolio,
        setSelectedPortfolio,
        currentAct,
        setCurrentAct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
