import { useState } from "react";
import { useQuery } from "react-query";
import { getAPI } from "src/axios";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import PostCard from "src/components/PostCard";

/* 타입 정의 */
interface Post {
  id: number;
  title: string;
  content: string;
  postId: number;
  isLiked: boolean;
}

/* API 요청 */
// API 요청을 통해 유저가 좋아요누른 게시글을 가져오는 코드
const fetchPosts = async (): Promise<Post[]> => {
  const response = await getAPI<{ posts: Post[] }>("/api/posts/like");
  return response.data.posts;
};

/* Profile 컴포넌트 */
function Profile() {
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery<Post[]>("likedPosts", fetchPosts);
  const [localPosts, setLocalPosts] = useState(posts);
  const handleLike = (postId: number) => {
    setLocalPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.postId === postId) {
          return { ...post, isLiked: !post.isLiked };
        }
        return post;
      });
    });
  };

  const likedPosts = localPosts.filter((post) => post.isLiked);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <div className=" h-screen flex justify-center items-center">
        <div className="w-[768px] h-[1000px] border-x-2 border-black flex flex-col items-center gap-4 justify-between overflow-auto px-2">
          <Navbar />
          <div className="w-full h-full flex flex-col justify-center items-center mt-8 gap-2">
            <div className="flex flex-col gap-2">
              <div className="w-[200px] h-[200px] rounded-full">
                <img
                  src={process.env.PUBLIC_URL + "/assets/default.png"}
                  alt="user_profile"
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-center items-center text-xl font-semibold">
                종훈
              </div>
            </div>
            <div className="w-full h-full grid grid-cols-2 mt-2 gap-2">
              {likedPosts.map((post) => {
                return (
                  <PostCard key={post.postId} post={post} onLike={handleLike} />
                );
              })}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Profile;
