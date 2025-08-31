import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Comment, CommentResponse } from '../src/api/api.client.ts';  
 

function Comment() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get<CommentResponse>('http://localhost:3000/api/admin/getAllComments');
        setComments(res.data.comments);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) return <div>Loading comments...</div>;

  return (
    <div>
      <h2>All Comments</h2>
      {comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc' }}>
            <p><strong>User:</strong> {comment.user}</p>
            <p><strong>Comment:</strong> {comment.text}</p>
            <p><strong>Post:</strong> {comment.post}</p>
            <p><small>Posted on: {new Date(comment.createdAt).toLocaleString()}</small></p>
          </div>
        ))
      )}
    </div>
  );
}

export default Comment;
