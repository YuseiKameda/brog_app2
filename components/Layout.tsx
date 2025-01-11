import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useContext(AuthContext);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4">
                <h1 className="text-xl font-bold">
                    <Link href="/">Brog App</Link>
                </h1>
                <nav>
                    <Link href="/posts" className="mr-4 hover:underline">投稿一覧</Link>
                    {user ? (
                        <>
                            <span>{user.email}</span>
                            <button onClick={handleLogout} className="hover:underline">ログアウト</button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/signin" className="mr-4 hover:underline">ログイン</Link>
                            <Link href="/auth/signup" className="hover:underline">サインアップ</Link>
                        </>
                    )}
                </nav>
            </header>
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>
            <footer className="bg-gray-200 text-center p-4">
                © {new Date().getFullYear()} Brog App
            </footer>
        </div>
    );
}

export default Layout;
