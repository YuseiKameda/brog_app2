import { NextPage } from "next";
import { useEffect, useState, useContext } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import Layout from "../../components/Layout";
import { Database } from '../../database.types';
import { AuthContext } from "@/context/AuthContext";

type Post = Database['public']['Tables']['posts']['Row'];

const PostsPage: NextPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { user } = useContext(AuthContext);

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
                            <p>{post.is_public ? "公開" : "非公開"}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </Layout>
    );
};

export default PostsPage;
