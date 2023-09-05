import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteAPI, getAPI, postAPI, putAPI } from "src/axios";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import { useQuery, useMutation } from "react-query";
import { FaEdit, FaTrash, FaCheck, FaPaperPlane } from "react-icons/fa";

/* 타입 정의 */
interface Post {
  title: string;
  content: string;
}

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

/* API 요청 */

// API 요청을 통해 게시글 가져오는 코드
const fetchPost = async (postId: string) => {
  const response = await getAPI(`/api/posts/${postId}`);
  return response.data.post;
};

// API 요청을 통해 댓글 가져오는 코드
const fetchComments = async (postId: string) => {
  const response = await getAPI(`/api/posts/${postId}/comments`);
  return response.data.comments;
};

// API 요청을 통해 댓글 추가하는 코드
const createComments = async (postId: string, commentContent: string) => {
  await postAPI(`/api/posts/${postId}/comments`, {
    content: commentContent,
  });
};

// API 요청을 통해 댓글 수정하는 코드
const updateComment = async ({
  postId,
  commentId,
  content,
}: CommentUpdateProps) => {
  await putAPI(`/api/posts/${postId}/comments/${commentId}`, { content });
};

// API 요청을 통해 댓글 삭제하는 코드
const deleteComment = async ({ postId, commentId }: CommentDeleteProps) => {
  await deleteAPI(`/api/posts/${postId}/comments/${commentId}`);
};

/* 컴포넌트 */
const Detail: FC = () => {
  const { id } = useParams();
  const postId: string = id as string;

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string>("");
  const [commentContent, setCommentContent] = useState<string>("");

  // react-query를 사용해 id의 게시글, 게시글에 대한 댓글들 가져오는 코드
  const { data: post, refetch: refetchPost } = useQuery<Post, Error>(
    ["post", postId],
    () => fetchPost(postId)
  );

  const { data: comments, refetch: refetchComments } = useQuery<
    Comment[],
    Error
  >(["comments", postId], () => fetchComments(postId));

  const refetchAll = () => {
    refetchPost();
    refetchComments();
  };

  /* 댓글 작성 코드*/
  const handleCommentSubmit = async () => {
    await createComments(postId, commentContent);
    setCommentContent("");
    refetchAll();
  };

  /* 댓글 수정 코드 */

  // 수정버튼을 눌렀을때 특정 댓글만 선택
  const handleEditClick = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedComment(currentContent);
  };

  // 댓글 수정 Mutation 정의
  const updateCommentMutation = useMutation<void, Error, CommentUpdateProps>(
    updateComment,
    {
      onSuccess: () => {
        refetchAll();
        setEditingCommentId(null);
        setEditedComment("");
      },
    }
  );

  // 댓글 수정 Mutation을 사용하여 댓글 수정
  const handleUpdateComment = () => {
    if (editingCommentId !== null) {
      updateCommentMutation.mutate({
        postId,
        commentId: String(editingCommentId),
        content: editedComment,
      });
    }
  };

  /* 댓글 삭제 코드 */

  // 댓글 삭제 Mutation 정의
  const deleteCommentMutation = useMutation<void, Error, CommentDeleteProps>(
    deleteComment,
    {
      onSuccess: refetchAll,
    }
  );
  
  // 댓글 삭제 Mutation을 사용하여 댓글 수정
  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate({ postId, commentId: String(commentId) });
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
