import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getAPI } from "src/axios";
import EditProfileModal from "src/components/EditProfileModal";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import PostCard from "src/components/PostCard";
import { HiPencil } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useModal from "src/hooks/useModal";

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
  const navigate = useNavigate();
  const initialUser = JSON.parse(localStorage.getItem("user") as string);
  const [user, setUser] = useState<User>(initialUser || {});

  const handleUserUpdate = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);
  /* 모달창 관리 코드 */
  const editProfileModal = useModal()
  const handleEditIconClick = useCallback((e: any) => {
    e.stopPropagation();
    editProfileModal.openModal();
    // eslint-disable-next-line
  }, []);

  const handleCloseModal = useCallback(() => {
    editProfileModal.closeModal();
    // eslint-disable-next-line
  }, []);

  /* 모달창 관리 코드 끝 */

  /* 좋아요누른 게시글 가져오는 코드 */
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery<Post[]>("likedPosts", fetchPosts, {
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        alert("로그인이 필요한 페이지입니다.");
        navigate("/");
      }
    },
  });
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

  if (isError) {
    return <div>Error</div>;
  }
  return (
    <>
      <div className="h-screen min-h-screen flex justify-center items-center">
        <div className="w-[768px] h-full border-x-2 border-black flex flex-col items-center gap-4 justify-between ">
          <Navbar />
          {isLoading ? (
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
                    <PostCard
                      key={post.postId}
                      post={post}
                      onLike={handleLike}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <Footer />
        </div>
        <EditProfileModal
          isOpen={editProfileModal.isOpen}
          onClose={handleCloseModal}
          user={user}
          onUserUpdate={handleUserUpdate}
          modalRef={editProfileModal.modalRef}
        />
      </div>
    </>
  );
}

export default Profile;
