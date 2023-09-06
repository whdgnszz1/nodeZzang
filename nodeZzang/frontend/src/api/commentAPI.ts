import { deleteAPI, getAPI, postAPI, putAPI } from "src/axios";
import { CommentDeleteProps, CommentUpdateProps } from "src/types/commentType";

// API 요청을 통해 게시글 가져오는 코드
export const fetchPost = async (postId: string) => {
  const response = await getAPI(`/api/posts/${postId}`);
  return response.data.post;
};

// API 요청을 통해 댓글 가져오는 코드
export const fetchComments = async (postId: string) => {
  const response = await getAPI(`/api/posts/${postId}/comments`);
  return response.data.comments;
};

// API 요청을 통해 댓글 추가하는 코드
export const createComments = async (
  postId: string,
  commentContent: string
) => {
  await postAPI(`/api/posts/${postId}/comments`, {
    content: commentContent,
  });
};

// API 요청을 통해 댓글 수정하는 코드
export const updateComment = async ({
  postId,
  commentId,
  content,
}: CommentUpdateProps) => {
  await putAPI(`/api/posts/${postId}/comments/${commentId}`, { content });
};

// API 요청을 통해 댓글 삭제하는 코드
export const deleteComment = async ({
  postId,
  commentId,
}: CommentDeleteProps) => {
  await deleteAPI(`/api/posts/${postId}/comments/${commentId}`);
};
