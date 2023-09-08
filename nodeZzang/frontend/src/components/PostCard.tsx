import React from "react";
import { postAPI } from "src/axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { PostResponse } from "src/types/postType";
import { formatDate } from "src/utils/formatDate";

type Props = {
  post: PostResponse;
  onLike: any;
};

const PostCard: React.FC<Props> = ({ post, onLike }) => {
  const navigate = useNavigate();

  const handleLikeClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await postAPI(`/api/posts/${post.postId}/like`, {});
      onLike(post.postId);
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 403) {
        alert("로그인이 필요한 기능입니다.");
      }
    }
  };

  const handleCardClick = () => {
    navigate(`/detail/${post.postId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border-2 border-black h-[300px] flex flex-col relative"
    >
      <div className="border-b-2 border-black w-full h-10 flex justify-between items-center px-2">
        <span className="flex gap-2">
          <img
            src={
              post.profileUrl && post.profileUrl.length > 0
                ? post.profileUrl
                : `${process.env.PUBLIC_URL}/assets/default.png`
            }
            alt="작성자 프로필"
            className="w-6 h-6 rounded-full"
          />
          {post.nickname}
        </span>
        <span>{post.createdAt && formatDate(post.createdAt)}</span>
      </div>
      <div className="border-b-2 border-black w-full h-10 flex items-center px-2">
        제목: {post.title}
      </div>
      <div className="w-full p-2">{post.content}</div>
      <div className="absolute right-3 bottom-2 flex items-center">
        {post.isLiked ? (
          <span onClick={handleLikeClick}>
            <AiFillHeart
              color="red"
              size={20}
              className="cursor-pointer mr-1"
            />
          </span>
        ) : (
          <span onClick={handleLikeClick}>
            <AiOutlineHeart size={20} className="cursor-pointer mr-1" />
          </span>
        )}
        {post.likeCount}
      </div>
    </div>
  );
};

export default PostCard;
