import React, { createContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
    session: Session | null;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
});

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event,session) => {
                setSession(session);
                setUser(session?.user ?? null);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, session }}>
            {children}
        </AuthContext.Provider>
    );
};
