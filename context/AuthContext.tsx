import React, { createContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";
import { Session, User } from '@supabase/supabase-js';
import { Database } from "@/database.types";

type AuthContextType = {
    user: User | null;
    session: Session | null;
};

type Profile = Database['public']['Tables']['profiles']['Row'];

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
    const [profile, setProfile] = useState<Profile>();

    useEffect(() => {
        const createProfileIfNotExists = async (user: User) => {
            // profilesテーブルから既存のプロフィールを取得
            const { data, error } = await supabase
                .from('profiles').select('*').eq('id', user.id).single();
                if (!error && data) {
                    setProfile(data as Profile);
                }

            // プロフィールが存在しない場合、作成する
            if (error && profile === null) {
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        username: user.email, // 初期値としてメールアドレスを設定。必要に応じて変更。
                        avatar_url: null,
                });

                if (insertError) {
                    console.error('Error creating profile:', insertError.message);
                }
            }
        };

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await createProfileIfNotExists(currentUser);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                const currentUser = session?.user ?? null;
                setUser(currentUser);
              // ユーザーが存在すればプロフィールを確認・作成
                if (currentUser) {
                    await createProfileIfNotExists(currentUser);
                }
            }
        );
          // コンポーネントアンマウント時にリスナーを解除
        return () => {
            subscription.unsubscribe();
        };
    }, [profile]);

    return (
        <AuthContext.Provider value={{ user, session }}>
            {children}
        </AuthContext.Provider>
    );
};
