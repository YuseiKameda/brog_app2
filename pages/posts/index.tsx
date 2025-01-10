import { NextPage } from "next";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Layout from "../../components/Layout";
import { Database } from '../../database.types';

type Post = Database['public']['Tables']['posts']['Row'];

const PostsPage: NextPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase.from("posts").select("id, title, is_public").eq("is_public", true);
            if (!error && data) {
                setPosts(data as Post[]);
            }
        };
        fetchPosts();
    }, []);


    return (
        <Layout>
            <h2 className="text-2xl font-semibold mb-4">投稿一覧</h2>
            <ul className="space-y-2">
                {posts.map((post) => (
                    <li key={post.id} className="p-4 border rounded hover:bg-gray-50">
                        <a href={`/posts/${post.id}`} className="text-xl text-blue-600 hover:underline">{post.title}</a>
                        <p>{post.is_public ? "公開" : "非公開"}</p>
                    </li>
                ))}
            </ul>
        </Layout>
    );
};

export default PostsPage;
