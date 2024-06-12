import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserCommentPage: React.FC = () => {
  const router = useRouter();
  const { userId } = router.query; // This will give you the userId from the URL

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/comments/user/${userId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (userId) {
      fetchComments();
    }
  }, [userId]);

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = now.getTime() - past.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (weeks > 0) {
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div>
      <h1>User Comments</h1>
      <div className="comment-container">
        {comments.map((comment: any) => (
          <div key={comment._id} className="comment-card">
            <p className="username">User: {comment.user.username}</p>
            <p className="comment-text">Comment: {comment.text}</p>
            <small>{timeAgo(new Date(comment.created_at * 1000).toISOString())}</small>
            <Link href={`/comments/creator/${comment.creator_id}`}>
              <div >Back to Creator Comments</div>
            </Link>
          </div>
        ))}
      </div>
      <style jsx>{`
        .comment-container {
          display: flex;
          flex-wrap: wrap;
        }

        .comment-card { 
          border-radius: 5px;
          padding: 10px;
          margin: 10px;
          width: 300px;

          
          border: 1px solid #191919;

          background: #0f0118;
        }

        .username {
          font-weight: bold;
        }

        .comment-text {
          margin-top: 5px;
        }

        .back-link {
          display: inline-block;
          margin-top: 10px;
          padding: 5px 10px;
          background-color: #6a1b9a;
          color: white;
          border-radius: 5px;
          text-decoration: none;
        }

        .back-link:hover {
          background-color: #8e24aa;
        }
      `}</style>
    </div>
  );
};

export default UserCommentPage;
