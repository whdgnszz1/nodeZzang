import { useState } from "react";
import { useParams } from "react-router-dom";
import { deleteAPI, getAPI, postAPI, putAPI } from "src/axios";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import { useQuery, useMutation } from "react-query";
import { FaEdit, FaTrash, FaCheck, FaPaperPlane } from "react-icons/fa";

interface Comment {
  commentId: number;
  content: string;
}

interface CommentUpdateProps {
  postId: string;
  commentId: string;
  content: string;
}

interface CommentDeleteProps {
  postId: string;
  commentId: string;
}

const fetchPost = async (postId: string) => {
  const response = await getAPI(`/api/posts/${postId}`);
  return response.data.post;
};

const fetchComments = async (postId: string) => {
  const response = await getAPI(`/api/posts/${postId}/comments`);
  return response.data.comments;
};

const Detail: React.FC = () => {
  const { id } = useParams();
  const postId = id as string;

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string>("");
  const [commentContent, setCommentContent] = useState<string>("");

  const { data: post } = useQuery(["post", postId], () => fetchPost(postId));
  const { data: comments } = useQuery(["comments", postId], () =>
    fetchComments(postId)
  );

  const postQuery = useQuery(["post", postId], () => fetchPost(postId));
  const commentsQuery = useQuery(["comments", postId], () =>
    fetchComments(postId)
  );
  const { refetch: refetchPost } = postQuery;
  const { refetch: refetchComments } = commentsQuery;

  const refetchAll = () => {
    refetchPost();
    refetchComments();
  };
  const updateComment = async ({
    postId,
    commentId,
    content,
  }: CommentUpdateProps) => {
    await putAPI(`/api/posts/${postId}/comments/${commentId}`, { content });
  };

  const deleteComment = async ({ postId, commentId }: CommentDeleteProps) => {
    await deleteAPI(`/api/posts/${postId}/comments/${commentId}`);
  };

  const updateMutation = useMutation<void, Error, CommentUpdateProps>(
    updateComment,
    {
      onSuccess: () => {
        refetchAll();
        setEditingCommentId(null);
        setEditedComment("");
      },
    }
  );

  const deleteMutation = useMutation<void, Error, CommentDeleteProps>(
    deleteComment,
    {
      onSuccess: refetchAll,
    }
  );

  const handleCommentSubmit = async () => {
    await postAPI(`/api/posts/${postId}/comments`, {
      content: commentContent,
    });
    setCommentContent("");
    refetchAll();
  };

  const handleEditClick = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedComment(currentContent);
  };

  const handleUpdateComment = () => {
    if (editingCommentId !== null) {
      updateMutation.mutate({
        postId,
        commentId: String(editingCommentId),
        content: editedComment,
      });
    }
  };

  const handleDeleteComment = (commentId: number) => {
    deleteMutation.mutate({ postId, commentId: String(commentId) });
  };

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <div className="w-[768px] h-[1000px] border-x-2 border-black flex flex-col items-center overflow-auto ">
          <Navbar />
          <div className="w-full flex items-center border-b-2 border-b-black mt-4 p-2">
            {post?.title}
          </div>
          <div className="w-full h-96 border-b-2 border-b-black flex items-start p-2">
            {post?.content}
          </div>
          <div className="w-full h-10 flex gap-2 ">
            <input
              className="w-full border-b-2 border-b-black p-1"
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력해주세요"
            />
            <button
              onClick={handleCommentSubmit}
              className="w-8 border-b-2 border-b-black p-1 flex justify-center items-center"
            >
              <FaPaperPlane />
            </button>
          </div>
          {comments?.map((comment: Comment, i: number) => (
            <div
              key={i}
              className="w-full h-10 border-b-2 border-b-black p-2 flex justify-between"
            >
              {editingCommentId === comment.commentId ? (
                <>
                  <input
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                  <button onClick={handleUpdateComment}>
                    <FaCheck />
                  </button>
                </>
              ) : (
                <>
                  <span>{comment.content}</span>
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        handleEditClick(comment.commentId, comment.content)
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Detail;
