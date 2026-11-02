"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/Lib/supabase";


type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean; // true until we know whether someone is logged in
  expired: boolean; // true if the visitor was logged out without asking (for example the session ran out)
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const manualSignOut = useRef(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      setLoading(false);
      if (event === "SIGNED_IN") setExpired(false);
      if (event === "SIGNED_OUT" && !manualSignOut.current) setExpired(true);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    manualSignOut.current = true;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch {
      // Offline or server trouble: still log THIS device out
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith("sb-"))
          .forEach((k) => localStorage.removeItem(k));
      } catch {}
      setSession(null);
    } finally {
      try { sessionStorage.removeItem("booking-draft"); } catch {} // do not leave a booking draft on a shared computer
      setExpired(false);
      manualSignOut.current = false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, session, loading, expired, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
