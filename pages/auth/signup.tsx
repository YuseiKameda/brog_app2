import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';
import { NextPage } from 'next';

const SignUp: NextPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSignUp= async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            setErrorMsg(error.message);
            return;
        } else {
            setSuccessMsg('確認メールを送信しました。メールをご確認ください。');
        }
    };

    return (
        <Layout>
            <h2 className='text-2xl font-semibold mb-4'>サインアップ</h2>
            <form onSubmit={handleSignUp} className='max-w-md mx-auto space-y-4'>
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
                {successMsg && <p className='text-green-500'>{successMsg}</p>}
                <button type="submit" className='w-full bg-blue-600 text-white p-2 rounded'>サインアップ</button>
            </form>
        </Layout>
    );
};

export default SignUp;
