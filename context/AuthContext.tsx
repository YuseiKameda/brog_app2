import React, { createContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";
import { Session, User } from '@supabase/supabase-js';
import { Database } from "@/database.types";

type AuthContextType = {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
};

type Profile = Database['public']['Tables']['profiles']['Row'];

export const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    profile: null,
});

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const createProfileIfNotExists = async (user: User) => {
            // profilesテーブルから既存のプロフィールを取得
            const { data, error } = await supabase
                .from('profiles').select('*').eq('id', user.id).single();
            if (data) {
                setProfile(data as Profile);
            } else if (error && error.code === 'PGRST116') {
                const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    username: user.email,
                    avatar_url: null,
                });

                if (insertError) {
                    console.error('Error creating profile:', insertError.message);
                } else {
                    // プロフィール作成後に再度取得
                    const { data: newProfile, error: newProfileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                    if (newProfile && !newProfileError) {
                        setProfile(newProfile);
                    }
                }
            } else if (error) {
                console.error('Error fetching profile:', error.message);
            }
        };


        // 初期ロード時に現在のセッション情報を取得
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await createProfileIfNotExists(currentUser);
            }
        });

        // 認証状態の変更を監視
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
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, profile }}>
            {children}
        </AuthContext.Provider>
    );
};
