import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Layout from "../../components/Layout";
import { NextPage } from "next";
import Image from "next/image";

type Post = {
    id: string;
    title: string;
    content: string;
    top_image_url?: string;
};

const PostDetail: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchPost = async () => {
            const { data, error } = await supabase.from<string, Post>("posts").select("*").eq("id", id).single();
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
            <div className="prose max-w-none">{post.content}</div>
        </Layout>
    );
};

export default PostDetail;
