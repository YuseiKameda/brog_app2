import { NextPage } from "next";
import { useEffect, useState, useContext } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import Layout from "../../components/Layout";
import { Database } from '../../database.types';
import { AuthContext } from "@/context/AuthContext";
import LikesButton from "@/components/LikesButton";
import BookmarksButton from "@/components/BookmarkButton";

type Post = Database['public']['Tables']['posts']['Row'];

const PostsPage: NextPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        let isMounted =true;

        const fetchPosts = async () => {
            const { data, error } = await supabase.from("posts").select("id, title, is_public, user_id").eq("is_public", true);
            if (isMounted && !error && data) {
                setPosts(data as Post[]);
            } else if (error) {
                console.error('Error fetching posts:', error.message);
            }
        };
        fetchPosts();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDelete = async (postId: string) => {
        const confirm = window.confirm('本当にこの投稿を削除しますか?');
        if (!confirm) return;

        const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

        if (error) {
            console.error('Error deleting post:', error.message);
            alert('投稿の削除に失敗しました');
        } else {
            setPosts(posts.filter((post) => post.id !== postId));
            alert('投稿が削除されました。')
        }
    }


    return (
        <Layout>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold mb-4">投稿一覧</h2>
                {user && (
                    <Link href='/posts/new' className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                        新規投稿
                    </Link>
                )}
            </div>
            <ul className="space-y-2">
                {posts.map((post) => (
                    <li key={post.id} className="p-4 border rounded hover:bg-gray-50">
                        <Link href={`/posts/${post.id}`} className="text-xl text-blue-600 hover:underline">
                            {post.title}
                        </Link>
                        <div>
                            <LikesButton postId={post.id}/>
                            <BookmarksButton postId={post.id}/>
                        </div>
                        {user && post.user_id === user.id && (
                            <div>
                                <Link href={`/posts/${post.id}/edit`} className="text-yellow-500 hover:underline">
                                    編集
                                </Link>
                                <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:underline">
                                    削除
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </Layout>
    );
};

export default PostsPage;
