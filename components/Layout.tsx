import React, { ReactNode } from "react";
import Link from "next/link";

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4">
                <h1 className="text-xl font-bold">
                    <Link href="/">Brog App</Link>
                </h1>
                <nav>
                    <Link href="/posts" className="mr-4 hover:underline">投稿一覧</Link>
                    <Link href="/auth/signin" className="mr-4 hover:underline">ログイン</Link>
                    <Link href="/auth/signup" className="hover:underline">サインアップ</Link>
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
