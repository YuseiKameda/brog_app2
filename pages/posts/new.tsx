import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';
import { NextPage } from 'next';
import { Database } from '../../database.types';

type PostInsert = Database['public']['Tables']['posts']['Insert'];

const NewPost: NextPage = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            setErrorMsg('ログインしてください');
            return;
        }

        const newPost: PostInsert = { user_id: user.id, title, content, is_public: true };

        const { error } = await supabase.from('posts').insert([newPost]);
        if (error) {
            setErrorMsg(error.message);
        } else {
            router.push('/posts');
        }
    };

    return (
        <Layout>
            <h2 className='text-2xl font-semibold mb-4'>新規投稿</h2>
            <form onSubmit={handleSubmit} className='max-w-md mx-auto space-y-4'>
                <input
                    type="text"
                    placeholder="タイトル"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='w-full p-2 border rounded'
                    required
                />
                <textarea
                    placeholder="内容"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className='w-full p-2 border rounded h-40'
                    required
                />
                {errorMsg && <p className='text-red-500'>{errorMsg}</p>}
                <button type="submit" className='w-full bg-blue-600 text-white p-2 rounded'>投稿</button>
            </form>
        </Layout>
    )
};

export default NewPost;
