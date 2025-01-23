import { NextPage } from 'next';
import { useState, useEffect, useContext } from 'react';
import Layout from '@/components/Layout';
import { AuthContext } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/database.types';
import Tabs from '../components/Tabs';
import PostList from '../components/PostList';

type Post = Database['public']['Tables']['posts']['Row'];

const ProfilePage: NextPage = () => {
    const { user, profile } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<string>('posts');
    const [myPosts, setMyPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!user) return;

        const fetchMyPosts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('id, title, is_public')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching my posts:', error.message);
            } else {
                setMyPosts(data as Post[]);
            }
            setLoading(false);
        };

        const fetchLikedPosts = async () => {
            setLoading(true);
            const { data: likedData, error: likedError } = await supabase
                .from('likes')
                .select('post_id')
                .eq('user_id', user.id);
            if (likedError) {
                console.error('Error fetching liked posts:', likedError.message);
                setLoading(false);
                return;
            }

            const likedPostIds = likedData?.map((like) => like.post_id) || [];

            if (likedPostIds.length === 0) {
                setLikedPosts([]);
                setLoading(false);
                return;
            }

            const { data: postsData, error: postsError } = await supabase
                .from("posts")
                .select("id, title, is_public")
                .in("id", likedPostIds)
                .order("created_at", { ascending: false });

            if (postsError) {
                console.error("Error fetching liked posts:", postsError.message);
            } else {
                setLikedPosts(postsData as Post[]);
            }
            setLoading(false);
        };

        const fetchBookmarkedPosts = async () => {
            setLoading(true);
            // Step 1: ユーザーが「ブックマーク」した投稿のpost_idを取得
            const { data: bookmarkedData, error: bookmarkedError } = await supabase
                .from("bookmarks")
                .select("post_id")
                .eq("user_id", user.id);

            if (bookmarkedError) {
                console.error("Error fetching bookmarked post IDs:", bookmarkedError.message);
                setLoading(false);
                return;
            }

            const bookmarkedPostIds = bookmarkedData?.map((bookmark) => bookmark.post_id) || [];

            if (bookmarkedPostIds.length === 0) {
                setBookmarkedPosts([]);
                setLoading(false);
                return;
            }

            // Step 2: 取得したpost_idを使用して投稿を取得
            const { data: postsData, error: postsError } = await supabase
                .from("posts")
                .select("id, title, is_public")
                .in("id", bookmarkedPostIds)
                .order("created_at", { ascending: false });

            if (postsError) {
                console.error("Error fetching bookmarked posts:", postsError.message);
            } else {
                setBookmarkedPosts(postsData as Post[]);
            }
            setLoading(false);
        };

        fetchMyPosts();
        fetchLikedPosts();
        fetchBookmarkedPosts();
    }, [user]);

    const handleDelete = async (postId: string) => {
        const confirmDelete = window.confirm('本当にこの投稿を削除しますか？');
        if (!confirmDelete) return;

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) {
            console.error('Error deleting post:', error.message);
            alert('投稿の削除に失敗しました。');
        } else {
            if (activeTab === "posts") {
                setMyPosts(myPosts.filter((post) => post.id !== postId));
            }
            alert('投稿が削除されました。');
        }
    };

    if (!user || !profile) {
        return (
            <Layout>
                <p>読み込み中...</p>
            </Layout>
        );
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <Layout>
            <div className='max-w-4xl mx-auto p-4'>
                <h1 className='text-3xl font-bold mb-4'>プロフィール</h1>
                <p className='text-xl mb-6'>ユーザー名：{profile.username}</p>

                <Tabs activeTab={activeTab} onTabChange={handleTabChange} />

                <div className='mt-4'>
                    {activeTab === 'posts' && (
                        <PostList posts={myPosts} loading={loading} title='自分の投稿一覧' onDelete={handleDelete} />
                    )}
                    {activeTab === 'likes' && (
                        <PostList posts={likedPosts} loading={loading} title='いいねした投稿一覧' />
                    )}
                    {activeTab === 'bookmarks' && (
                        <PostList posts={bookmarkedPosts} loading={loading} title='ブックマークした投稿一覧' />
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default ProfilePage;
