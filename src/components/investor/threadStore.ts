import { useEffect, useState, useCallback } from "react";
import type { UIMessage } from "ai";

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const KEY = "founderverse.investor.threads.v1";

function read(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Thread[]) : [];
  } catch {
    return [];
  }
}

function write(threads: Thread[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(threads));
}

function makeId() {
  return "t_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>(() => read());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setThreads(read());
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setThreads(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = useCallback((next: Thread[]) => {
    setThreads(next);
    write(next);
  }, []);

  const createThread = useCallback((): Thread => {
    const t: Thread = {
      id: makeId(),
      title: "Новый разбор сделки",
      updatedAt: Date.now(),
      messages: [],
    };
    const next = [t, ...read()];
    write(next);
    setThreads(next);
    return t;
  }, []);

  const deleteThread = useCallback((id: string) => {
    const next = read().filter((t) => t.id !== id);
    write(next);
    setThreads(next);
  }, []);

  const updateThread = useCallback(
    (id: string, patch: Partial<Thread>) => {
      const next = read().map((t) => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t));
      write(next);
      setThreads(next);
    },
    []
  );

  return { threads, hydrated, createThread, deleteThread, updateThread, persist };
}

export function loadThread(id: string): Thread | undefined {
  return read().find((t) => t.id === id);
}

export function saveThreadMessages(id: string, messages: UIMessage[], titleHint?: string) {
  const threads = read();
  const existing = threads.find((t) => t.id === id);
  const title =
    existing?.title && existing.title !== "Новый разбор сделки" && existing.title !== "New deal review"
      ? existing.title
      : titleHint?.slice(0, 60) || existing?.title || "Новый разбор сделки";
  const updated: Thread = existing
    ? { ...existing, messages, title, updatedAt: Date.now() }
    : { id, title, messages, updatedAt: Date.now() };
  const next = existing
    ? threads.map((t) => (t.id === id ? updated : t))
    : [updated, ...threads];
  write(next);
}