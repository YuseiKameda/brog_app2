import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Layout from '@/components/Layout';
import { NextPage } from 'next';

const SignIn: NextPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setErrorMsg(error.message);
            return;
        } else {
            // ログイン成功時ホームにリダイレクト
            window.location.href = '/';
        }
    };

    return (
        <Layout>
            <h2 className='text-2xl font-semibold mb-4'>サインイン</h2>
            <form onSubmit={handleSignIn} className='max-w-md mx-auto space-y-4'>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full p-2 border rounded'
                    required
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full p-2 border rounded'
                    required
                />
                {errorMsg && <p className='text-red-500'>{errorMsg}</p>}
                <button type="submit" className='w-full bg-blue-600 text-white p-2 rounded'>サインイン</button>
            </form>
        </Layout>
    );
};

export default SignIn;
