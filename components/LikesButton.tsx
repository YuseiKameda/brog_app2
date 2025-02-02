import React, { useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AuthContext } from "@/context/AuthContext";
// import { Database } from "@/database.types";

// type Like = Database['public']['Tables']['likes']['Row'];

type LikesButtonProps = {
    postId: string;
};

const LikesButton: React.FC<LikesButtonProps> = ({ postId }) => {

    const { user } = useContext(AuthContext);
    const [hasLiked, setHasLiked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect (() => {
        if (!user) return;

        const checkLikeStatus = async () => {
            const { data, error } = await supabase
                .from('likes')
                .select('id')
                .eq('user_id', user.id)
                .eq('post_id', postId)
                .single();
            
            if (error && error.code !== 'PGRST116') {
                console.error('Error checking like status:', error.message);
            }
            setHasLiked(!!data);
        };

        checkLikeStatus();
    }, [user, postId])

    const toggleLike = async () => {
        if(!user) return;
        setLoading(true);

        if (hasLiked) {
            // いいね解除
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('user_id', user.id)
                .eq('post_id', postId);
            if (error) {
                console.error('Error removing like:', error.message);
            }
            setHasLiked(false);
        } else {
            // いいね追加
            const { error } = await supabase
                .from('likes')
                .insert({
                    user_id: user.id,
                    post_id: postId
                });
            if (error) {
                console.error('Error adding like:', error.message);
            }
            setHasLiked(true);
        }
        setLoading(false);
    };

    return (
        <button
            onClick={toggleLike}
            disabled={loading}
            className="px-3 py-1 border rounded hover:bg-gray-100"
            >
            {hasLiked ? 'いいね解除' : 'いいね'}
        </button>
    );
};

export default LikesButton;