import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import { useQuery, useMutation } from "react-query";
import { FaEdit, FaTrash, FaCheck, FaPaperPlane } from "react-icons/fa";
import {
  Comment,
  CommentDeleteProps,
  CommentUpdateProps,
} from "src/types/commentType";
import {
  createComments,
  deleteComment,
  fetchComments,
  fetchPost,
  updateComment,
} from "src/api/commentAPI";
import { PostResponse } from "src/types/postType";
import { User } from "src/types/userType";

/* 컴포넌트 */
const Detail: FC = () => {
  const { id } = useParams();
  const postId: string = id as string;
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string>("");
  const [commentContent, setCommentContent] = useState<string>("");
  const initialUser = JSON.parse(localStorage.getItem("user") as string);
  const [user] = useState<User>(initialUser || {});

  // react-query를 사용해 id의 게시글, 게시글에 대한 댓글들 가져오는 코드
  const {
    data: post,
    refetch: refetchPost,
    isLoading: postLoading,
  } = useQuery<PostResponse, Error>(["post", postId], () => fetchPost(postId));

  const {
    data: comments,
    refetch: refetchComments,
    isLoading: commentsLoading,
  } = useQuery<Comment[], Error>(["comments", postId], () =>
    fetchComments(postId)
  );

  const refetchAll = () => {
    refetchPost();
    refetchComments();
  };

  /* 댓글 작성 코드*/
  const handleCommentSubmit = async () => {
    try {
      await createComments(postId, commentContent);
      setCommentContent("");
      refetchAll();
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 403) {
        alert("로그인이 필요한 기능입니다.");
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && commentContent.trim()) {
      handleCommentSubmit();
    }
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
      onError: (error: any) => {
        if (error?.response?.status === 403) {
          alert("로그인이 필요한 기능입니다.");
        }
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
      onError: (error: any) => {
        if (error?.response?.status === 403) {
          alert("로그인이 필요한 기능입니다.");
        }
      },
    }
  );

  // 댓글 삭제 Mutation을 사용하여 댓글 수정
  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate({ postId, commentId: String(commentId) });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    const month = date.getMonth() + 1; // 0-based indexing, so add 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${month}월 ${day}일 ${hours}시 ${minutes}분`;
  };

  return (
    <>
      <div className="h-screen min-h-screen flex justify-center items-center">
        <div className="w-[768px] h-full border-x-2 border-black flex flex-col items-center overflow-auto mt-16 ">
          <Navbar />
          {postLoading || commentsLoading ? (
            <>
              <div className="w-screen h-screen flex justify-center items-center">
                <img
                  src={process.env.PUBLIC_URL + "/assets/loading.gif"}
                  alt="loading_spinner"
                />
              </div>
              ;
            </>
          ) : (
            <>
              <div className="w-full h-10 flex justify-between items-center border-b-2 border-b-black mt-4 p-2">
                <div>작성자: {post?.nickname}</div>
                <div>{post?.createdAt && formatDate(post.createdAt)}</div>
              </div>

              <div className="w-full flex items-center border-b-2 border-b-black  p-2">
                {post?.title}
              </div>
              <div className="w-full h-96 border-b-2 border-b-black flex items-start p-2">
                {post?.content}
              </div>
              <div className="w-full h-10 flex gap-2 ">
                <input
                  className="w-full border-b-2 border-b-black p-1 focus:outline-none px-2"
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  onKeyPress={handleKeyPress}
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
                      <div className="flex justify-between w-full">
                        <div className="flex gap-2">
                          <div className="w-16 border-r-2 border-black">
                            {comment.nickname}
                          </div>
                          {comment.content}
                        </div>
                        <span className="pr-2">
                          {comment.createdAt && formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <div className="flex gap-4">
                        {comment.userId === Number(user.userId) && (
                          <button
                            onClick={() =>
                              handleEditClick(
                                comment.commentId,
                                comment.content
                              )
                            }
                          >
                            <FaEdit />
                          </button>
                        )}
                        {comment.userId === Number(user.userId) && (
                          <button
                            onClick={() =>
                              handleDeleteComment(comment.commentId)
                            }
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </>
          )}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Detail;
