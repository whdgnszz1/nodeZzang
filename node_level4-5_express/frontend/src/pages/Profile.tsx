import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getAPI } from "src/axios";
import EditProfileModal from "src/components/EditProfileModal";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import PostCard from "src/components/PostCard";
import { HiPencil } from "react-icons/hi";

/* 타입 정의 */
interface Post {
  id: number;
  title: string;
  content: string;
  postId: number;
  isLiked: boolean;
}

interface User {
  userId: string;
  nickname: string;
  profileUrl: string;
}

/* API 요청 */
// API 요청을 통해 유저가 좋아요누른 게시글을 가져오는 코드
const fetchPosts = async (): Promise<Post[]> => {
  const response = await getAPI<{ posts: Post[] }>("/api/posts/like");
  return response.data.posts;
};

/* Profile 컴포넌트 */
function Profile() {
  const [user, setUser] = useState<User>(
    JSON.parse(localStorage.getItem("user") as string)
  );
  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };
  /* 모달창 관리 코드 */
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const handleEditIconClick = (e: any) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (e.target.closest(".modal-content")) return;
      handleCloseModal();
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  /* 모달창 관리 코드 끝 */

  /* 좋아요누른 게시글 가져오는 코드 */
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery<Post[]>("likedPosts", fetchPosts);
  const [localPosts, setLocalPosts] = useState(posts);

  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

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
  console.log(isEditModalOpen);
  return (
    <>
      <div className="h-screen min-h-screen flex justify-center items-center">
        <div className="w-[768px] h-full border-x-2 border-black flex flex-col items-center gap-4 justify-between ">
          <Navbar />
          <div className="w-full h-full flex flex-col mt-20 gap-2">
            <div className="flex flex-col gap-4 border-b-2 border-black w-full justify-center items-center">
              <div className="relative w-[200px] h-[200px] rounded-full">
                <img
                  src={
                    user.profileUrl
                      ? user.profileUrl
                      : process.env.PUBLIC_URL + "/assets/default.png"
                  }
                  alt="user_profile"
                  className="rounded-full"
                />
                <div className="absolute bottom-[-8px] right-0 mb-2 mr-2 cursor-pointer">
                  <div onClick={handleEditIconClick}>
                    <HiPencil size={24} />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center text-xl font-semibold mb-4 cursor-default">
                {user.nickname}
              </div>
            </div>
            <div className="w-full mt-6 grid grid-cols-2 gap-2 overflow-auto px-2">
              {likedPosts.map((post) => {
                return (
                  <PostCard key={post.postId} post={post} onLike={handleLike} />
                );
              })}
            </div>
          </div>
          <Footer />
        </div>
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          user={user}
          onUserUpdate={handleUserUpdate}
        />
      </div>
    </>
  );
}

export default Profile;
