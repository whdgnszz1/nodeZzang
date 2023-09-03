import { useEffect, useState } from "react";
import { getAPI } from "src/axios";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import PostCard from "src/components/PostCard";

function Profile() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getAPI("/api/posts/like").then((data) => data);
      setPosts(response.data.posts);
    };
    fetchPosts();
  }, []);

  const handleLike = (postId: number) => {
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.postId === postId) {
          return { ...post, isLiked: !post.isLiked };
        }
        return post;
      });
    });
  };

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
              <div className="flex justify-center items-center text-xl font-semibold">종훈</div>
            </div>
            <div className="w-full h-full grid grid-cols-2 mt-2 gap-2">
              {posts
                .filter((post) => post.isLiked === true)
                .map((post, i) => {
                  return <PostCard key={i} post={post} onLike={handleLike} />;
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
