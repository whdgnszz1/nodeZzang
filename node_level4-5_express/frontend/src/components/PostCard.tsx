import React from "react";
import { postAPI } from "src/axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

type PostType = {
  postId: number;
  title: string;
  content: string;
  isLiked: boolean;
};

type Props = {
  post: PostType;
  onLike: any;
};

const PostCard: React.FC<Props> = ({ post, onLike }) => {
  const navigate = useNavigate()

  const handleLikeClick = async (event:React.MouseEvent) => {
    event.stopPropagation()
    try {
      await postAPI(`/api/posts/${post.postId}/like`, {});
      onLike(post.postId);
    } catch (error:any) {
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
    <div onClick={handleCardClick} className="border-2 border-black h-[300px] flex flex-col relative">
      <div className="border-b-2 border-black w-full h-10 flex items-center px-2">
        {post.title}
      </div>
      <div className="w-full p-2">{post.content}</div>
      <div className="absolute right-3 bottom-2">
        {post.isLiked ? (
          <span onClick={handleLikeClick}>
            <AiFillHeart color="red" size={16} />
          </span>
        ) : (
          <span onClick={handleLikeClick}>
            <AiOutlineHeart />
          </span>
        )}
      </div>
    </div>
  );
};

export default PostCard;
