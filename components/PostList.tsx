import React from 'react';
import Link from 'next/link';
import { Database } from '../database.types';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

type Post = Database['public']['Tables']['posts']['Row'];

type PostsListProps = {
    posts: Post[];
    loading: boolean;
    title: string;
    onDelete?: (postId: string) => void;
};

const PostsList: React.FC<PostsListProps> = ({ posts, loading, title, onDelete }) => {
    const { user } = useContext(AuthContext);

    if (loading) {
        return <p>読み込み中...</p>;
    }

    if (posts.length === 0) {
        return <p>{title}はまだありません。</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <ul className="space-y-2">
                {posts.map((post) => (
                    <li key={post.id} className="p-4 border rounded hover:bg-gray-50 flex justify-between items-center">
                        <Link href={`/posts/${post.id}`} className="text-xl text-blue-600 hover:underline">
                                {post.title}
                        </Link>
                        {user && post.user_id === user.id && (
                            <div className="space-x-2">
                                <Link href={`/posts/${post.id}/edit`} className="text-xl text-blue-600 hover:underline">
                                        編集
                                </Link>
                                <button
                                    onClick={() => onDelete && onDelete(post.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    削除
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostsList;
