import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Post, PostResponse } from '../src/api/api.client.ts';

function Post() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loadingSingle, setLoadingSingle] = useState(false);

 
  useEffect(() => {
    axios
      .get<PostResponse>('http://localhost:3000/api/admin/getAllPosts')
      .then((res) => {
        setPosts(res.data.posts);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching posts:', err);
        setLoading(false);
      });
  }, []);

   
  const fetchSinglePost = (postId: string) => {
    setLoadingSingle(true);
    axios
      .get<{ post: Post }>(`http://localhost:3000/api/admin/getSinglePost/${postId}`)
      .then((res) => {
        setSelectedPost(res.data.post);
        setLoadingSingle(false);
      })
      .catch((err) => {
        console.error('Error fetching single post:', err);
        setLoadingSingle(false);
      });
  };

  // If a single post is selected, render that
  if (selectedPost) {
    if (loadingSingle) return <div>Loading post...</div>;

    return (
      <div className="p-4 border rounded shadow">
        <button
          onClick={() => setSelectedPost(null)}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Back to All Posts
        </button>
        <div className="flex items-center gap-2 mb-2">
          <img
            src={selectedPost.profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-bold">{selectedPost.user}</p>
            <p className="text-sm text-gray-500">
              {selectedPost.section}, {selectedPost.year}
            </p>
          </div>
        </div>
        <p className="mb-2">{selectedPost.text}</p>
        {selectedPost.postImage && (
          <img
            src={selectedPost.postImage}
            alt="Post"
            className="w-full max-h-60 object-cover rounded"
          />
        )}
        <p className="text-xs text-gray-400 mt-1">
          Posted at {new Date(selectedPost.createdAt).toLocaleString()}
        </p>
      </div>
    );
  }

  // Otherwise, show the list of posts
  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.postId}
            className="border p-4 mb-4 rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => fetchSinglePost(post.postId)}
          >
            <div className="flex items-center gap-2 mb-2">
              <img
                src={post.profilePicture}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-bold">{post.user}</p>
                <p className="text-sm text-gray-500">
                  {post.section}, {post.year}
                </p>
              </div>
            </div>
            <p className="mb-2">{post.text}</p>
            {post.postImage && (
              <img
                src={post.postImage}
                alt="Post"
                className="w-full max-h-60 object-cover rounded"
              />
            )}
            <p className="text-xs text-gray-400 mt-1">
              Posted at {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Post;
