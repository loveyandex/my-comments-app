import { GetServerSideProps } from "next";
import Link from "next/link";
import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import { ParsedUrlQuery } from "querystring";

interface Comment {
  pk: string;
  user_id: string;
  text: string;
  created_at: string;
  user: {
    username: string;
    profile_pic_url: string;
  };
}

interface Props {
  initialComments: Comment[];
  creator_id: string;
  initialPage: number;
}

interface Params extends ParsedUrlQuery {
  creator_id: string;
}

const CommentsPage = ({ initialComments, creator_id, initialPage }: Props) => {
  const [comments, setComments] = useState(initialComments);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const newCommentsRef = useRef<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchComments = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/comments/creator/${creator_id}?page=${pageNum}&limit=10`
      );
      const newComments = response.data;
      newComments.forEach((comment: Comment) => newCommentsRef.current.add(comment.pk));
      setComments((prev) => [...prev, ...newComments]);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
    setLoading(false);
  };

  const loadMoreComments = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage);
  }, [page]);

  useEffect(() => {
    if (newCommentsRef.current.size > 0) {
      const timer = setTimeout(() => {
        newCommentsRef.current.clear();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [comments]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreComments();
        }
      },
      { threshold: 1.0 }
    );
    observerRef.current = observer;

    const target = document.querySelector('#load-more-trigger');
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (observerRef.current && target) {
        observerRef.current.unobserve(target);
      }
    };
  }, [loadMoreComments, loading]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Copied to clipboard successfully!");
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  return (
    <div>
      <h1>Comments for Creator {creator_id}</h1>
      <div className="comments-list">
        {comments.map((comment) => (
          <div
            key={comment.pk}
            className={`comment-card ${newCommentsRef.current.has(comment.pk) ? 'new-comment' : ''}`}
          >
            {/* <img
              src={comment.user.profile_pic_url}
              alt={comment.user.username}
              className="avatar"
            /> */}
            <div>
              <div className="username-container">
                <Link href={`/user/comments/${comment.user_id}`}>
                  <h3>{comment.user.username}</h3> 
                </Link>
                <button onClick={() => copyToClipboard(comment.user.username)} className="copy-button">
                  Copy
                </button>
              </div>
              <p>{comment.text}</p>
              <small>
                {timeAgo(new Date(comment.created_at*1000).toISOString())}
              </small>
            </div>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      <div id="load-more-trigger" style={{ height: 1 }}>load more </div>

      <style jsx>{`
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .comment-card {
          background-color: #120c18;
          border: 1px solid #1d0e2b;
          border-radius: 5px;
          padding: 20px;
          color: #9e75c2;
          display: flex;
          gap: 10px;
          transition: background-color 3s;
        }
        .new-comment {
          background-color: #860045;
          animation: fadeOut 3s forwards;
        }
        @keyframes fadeOut {
          0% {
            background-color: #860045;
          }
          100% {
            background-color: #120c18;
          }
        }
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .username-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .copy-button {
          padding: 5px 10px;
          font-size: 0.9rem;
          background-color: #6a1b9a;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }
        .copy-button:hover {
          background-color: #8e24aa;
        }
        button:disabled {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async (context) => {
  const { creator_id } = context.params as Params;
  const page = 1;

  try {
    const response = await axios.get(
      `http://localhost:3000/api/comments/creator/${creator_id}?page=${page}&limit=10`
    );
    return {
      props: {
        initialComments: response.data,
        creator_id,
        initialPage: page,
      },
    };
  } catch (error) {
    return {
      props: {
        initialComments: [],
        creator_id,
        initialPage: page,
      },
    };
  }
};

export default CommentsPage;

function timeAgo(dateString: string) {
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
}
