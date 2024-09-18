"use client";

import { Session, User } from "lucia";
import { createContext, PropsWithChildren, useContext } from "react";

interface SessionContext {
  user: User;
  session: Session;
}

interface SessionProviderProps extends PropsWithChildren {
  value: SessionContext;
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: SessionProviderProps) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (context === null) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
}
