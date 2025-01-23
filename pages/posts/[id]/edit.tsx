import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Layout from '@/components/Layout';
import { NextPage } from 'next';
import { Database } from '@/database.types';
import { AuthContext } from '@/context/AuthContext';

type Post = Database['public']['Tables']['posts']['Row'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];

const EditPost: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useContext(AuthContext);
    const [post, setPosts] = useState<Post | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!id || Array.isArray(id)) return;

        const fetchPost = async () => {
            const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

            if (error) {
                console.error('Error fetching post:', error.message);
                setErrorMsg('投稿の取得に失敗しました。');
            } else if (data) {
                if (user && data.user_id !== user.id) {
                    setErrorMsg('権限がありません。');
                    return;
                }
                setPosts(data);
                setTitle(data.title);
                setContent(data.content || '');
            }
        };

        fetchPost();
    }, [id, user]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!post) {
            setErrorMsg('投稿が存在しません')
            return;
        }

        const updatedPost: PostUpdate = {
            title,
            content,
        };

        const { error } = await supabase
        .from('posts')
        .update(updatedPost)
        .eq('id',post.id);

        if (error) {
            console.error('Error updating post:', error.message);
            setErrorMsg('投稿の更新に失敗しました');
        } else {
            alert('投稿が更新されました');
            router.push('/posts');
        }
    };

    if (errorMsg) {
        return (
            <Layout>
                <p className='text-red-500'>{errorMsg}</p>
            </Layout>
        );
    }

    if (!post) {
        return (
            <Layout>
                <p>読み込み中...</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <h2 className='text-2xl font-semibold mb-4'>投稿を編集</h2>
            <form onSubmit={handleUpdate} className='max-w-md mx-auto soace-y-4'>
                <div>
                    <label htmlFor="title" className='block text-sm font-medium text-gray-700'>
                        タイトル
                    </label>
                    <input
                    type="text"
                    id='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='mt-1 block w-full p-2 border rounded'
                    required
                    />
                </div>
                <div>
                    <label htmlFor="content" className='block text-sm font-medium text-gray-700'>
                        内容
                    </label>
                    <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className='mt-1 block w-full p-2 border rounded h-40'
                    required
                    />
                </div>
                {errorMsg && <p className='text-red-500'>{errorMsg}</p>}
                <button type='submit' className='w-full bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700'>
                    更新する
                </button>
            </form>
        </Layout>
    );
}

export default EditPost;
