import React, { useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AuthContext } from '@/context/AuthContext';

type BookmarksButtonProps = {
    postId: string;
};

const BookmarksButton: React.FC<BookmarksButtonProps> = ({ postId }) => {

    const { user } = useContext(AuthContext);
    const [hasBookmarked, setHasBookmarked] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect (() => {
        if (!user) return;

        const checkBookmarkStatus = async () => {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', user.id)
                .eq('post_id', postId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error checking bookmark status:', error.message);
            }
            setHasBookmarked(!!data);
        };

        checkBookmarkStatus();
    }, [user, postId])

    const toggleBookmark = async () => {
        if (!user) return;
        setLoading(true);

        if (hasBookmarked) {
            // ブックマーク解除
            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', user.id)
                .eq('post_id', postId);
            if (error) {
                console.error('Error removing bookmark:', error.message);
            }
            setHasBookmarked(false);
        } else {
            // ブックマーク追加
            const { error } = await supabase
                .from('bookmarks')
                .insert({
                    user_id: user.id,
                    post_id: postId
                });
            if (error) {
                console.error('Error adding bookmark:', error.message);
            }
            setHasBookmarked(true);
        }
        setLoading(false);
    };

    return (
        <button
            onClick={toggleBookmark}
            disabled={loading}
            className='px-3 py-1 border rounded hover:bg-gray-100'
        >
            {hasBookmarked ? 'ブックマーク解除' : 'ブックマーク'}
        </button>
    );
};

export default BookmarksButton;