import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Layout from "../../components/Layout";
import { NextPage } from "next";
import Image from "next/image";
import { Database } from '../../database.types';
import LikesButton from "@/components/LikesButton";
import BookmarksButton from "@/components/BookmarkButton";

type Post = Database['public']['Tables']['posts']['Row'];

const PostDetail: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState<Post>();

    useEffect(() => {
        if (!id) return;
        const fetchPost = async () => {
            const { data, error } = await supabase.from("posts").select("*").eq("id", id as string).single();
            if (!error) {
                setPost(data);
            }
        };
        fetchPost();
    }, [id]);

    if (!post) return <Layout><p>読み込み中</p></Layout>;

    return (
        <Layout>
            <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
            {post.top_image_url && (
                <Image src={post.top_image_url} alt={post.title} className="w-full mb-4" />
            )}
            <div>
                <LikesButton postId={post.id}/>
                <BookmarksButton postId={post.id}/>
            </div>
            <div className="prose max-w-none">{post.content}</div>
        </Layout>
    );
};

export default PostDetail;
