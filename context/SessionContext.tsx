"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MENTORS } from "@/lib/data";

export type Session = {
  id: string;
  mentorId: string;
  date: string;
  time: string;
  duration: number;
  status: "upcoming" | "past";
  notes?: string;
  summary?: {
    takeaways: string[];
    actionItems: string[];
    nextTopics: string[];
  };
};

type SessionContextType = {
  sessions: Session[];
  bookSession: (
    mentorId: string,
    date: Date,
    time: string
  ) => void;
  updateNotes: (sessionId: string, notes: string) => void;
  saveSummary: (sessionId: string, summary: Session["summary"]) => void;
  completeSession: (sessionId: string) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);

  // Hydrate with some initial past sessions for demo purposes
  useEffect(() => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);

    setSessions([
      {
        id: "s_demo_1",
        mentorId: MENTORS[1].id,
        date: pastDate.toISOString().split("T")[0],
        time: "14:00",
        duration: 30,
        status: "past",
      },
    ]);
  }, []);

  const bookSession = (mentorId: string, date: Date, time: string) => {
    const newSession: Session = {
      id: Math.random().toString(36).substring(7),
      mentorId,
      date: date.toISOString().split("T")[0],
      time,
      duration: 30,
      status: "upcoming",
    };
    setSessions((prev) => [...prev, newSession]);
  };

  const updateNotes = (sessionId: string, notes: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, notes } : s))
    );
  };

  const saveSummary = (sessionId: string, summary: Session["summary"]) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, summary } : s))
    );
  };

  const completeSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: "past" } : s))
    );
  };

  return (
    <SessionContext.Provider
      value={{ sessions, bookSession, updateNotes, saveSummary, completeSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessions must be used within a SessionProvider");
  }
  return context;
}
