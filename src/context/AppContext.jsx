import { createContext, useContext, useState } from "react";
import usersData from "../data/users.json";
import clientsData from "../data/clients.json";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [currentAct, setCurrentAct] = useState(1);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  // Mutable runtime lists (initialised from JSON on login)
  const [rms, setRms] = useState([]);
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);

  // ── Auth ────────────────────────────────────────────────────────────
  function login(id, password) {
    const found = usersData.find(
      (u) => u.id === id.trim() && u.password === password
    );
    if (!found) return false;

    setUser({
      id: found.id,
      name: found.name,
      role: found.role,
      initials: found.initials,
    });

    // Seed runtime data
    const allRms = usersData.filter((u) => u.role === "rm");
    setRms(allRms);

    const allClients = clientsData.map((c) => ({ ...c }));
    setClients(allClients);

    // Flatten all sessions across all clients
    const allSessions = clientsData.flatMap((c) =>
      c.sessions.map((s) => ({ ...s, client_id: c.id, rm_id: c.rm_id }))
    );
    setSessions(allSessions);

    setSessionStartTime(new Date().toISOString());
    return found;
  }

  function logout() {
    setUser(null);
    setSelectedPortfolio(null);
    setSelectedClient(null);
    setCurrentAct(1);
    setSessionStartTime(null);
    setRms([]);
    setClients([]);
    setSessions([]);
  }

  // ── Client management ───────────────────────────────────────────────
  function addClient(clientObj) {
    setClients((prev) => [...prev, clientObj]);
  }

  // ── RM management ───────────────────────────────────────────────────
  function addRm(rmObj) {
    setRms((prev) => [...prev, rmObj]);
  }

  function deactivateRm(rmId) {
    setRms((prev) =>
      prev.map((r) => (r.id === rmId ? { ...r, status: "inactive" } : r))
    );
  }

  // ── Session tracking ────────────────────────────────────────────────
  function startDemoSession(clientId, portfolioId) {
    const newSession = {
      id: `S${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      portfolio_used: portfolioId,
      duration_minutes: 0,
      pdf_exported: false,
      acts_completed: 0,
      client_id: clientId,
      rm_id: user?.id,
      _startedAt: Date.now(),
    };
    setSessions((prev) => [...prev, newSession]);
    setSessionStartTime(new Date().toISOString());
    return newSession.id;
  }

  function markPdfExported(sessionId) {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, pdf_exported: true } : s
      )
    );
    setClients((prev) =>
      prev.map((c) => ({
        ...c,
        sessions: c.sessions.map((s) =>
          s.id === sessionId ? { ...s, pdf_exported: true } : s
        ),
      }))
    );
  }

  function completeAct(actNumber) {
    setCurrentAct(actNumber);
    // Update the last open session's acts_completed
    setSessions((prev) => {
      const idx = [...prev].reverse().findIndex((s) => s.rm_id === user?.id);
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      return prev.map((s, i) =>
        i === realIdx
          ? {
              ...s,
              acts_completed: Math.max(s.acts_completed, actNumber),
              duration_minutes: Math.round(
                (Date.now() - (s._startedAt || Date.now())) / 60000
              ),
            }
          : s
      );
    });
  }

  return (
    <AppContext.Provider
      value={{
        // Auth
        user,
        login,
        logout,
        // Demo state (legacy-compatible: session = user for RM screens)
        session: user
          ? { rmId: user.id, name: user.name, initials: user.initials, sessionStartTime }
          : null,
        sessionStartTime,
        // Portfolio / client selection
        selectedPortfolio,
        setSelectedPortfolio,
        selectedClient,
        setSelectedClient,
        // Act tracking
        currentAct,
        setCurrentAct,
        completeAct,
        // Data collections
        rms,
        clients,
        sessions,
        // Mutations
        addClient,
        addRm,
        deactivateRm,
        startDemoSession,
        markPdfExported,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
