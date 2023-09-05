import { useCallback, useEffect, useRef, useState } from "react";
import { getAPI, postAPI } from "src/axios";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import PostCard from "src/components/PostCard";
import { useMutation, useQuery } from "react-query";

/* 타입 정의 */
interface Post {
  id: number;
  title: string;
  content: string;
  postId: number;
  isLiked: boolean;
}

interface NewPost {
  title: string;
  content: string;
}

/* API 요청 */
// API 요청을 통해 게시글을 가져오는 코드
const fetchPosts = async (): Promise<Post[]> => {
  const response = await getAPI<{ posts: Post[] }>("/api/posts");
  return response.data.posts;
};

// API 요청을 통해 게시글을 추가하는 코드
const createPost = async (newPost: NewPost): Promise<Post> => {
  const response = await postAPI<NewPost, Post>("/api/posts", newPost);
  return response.data;
};

const Main = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    data: posts,
    refetch,
    error,
    isLoading,
    isError,
  } = useQuery("posts", fetchPosts);

  const createPostMutation = useMutation(createPost, {
    onSuccess: () => {
      refetch();
    },
  });

  const handleLike = () => {
    refetch();
  };

  /* 모달 관련 코드 */
  const closeModal = () => {
    setShowModal(false);
    setTitle("");
    setContent("");
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside as any);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, [handleClickOutside]);

  /* 게시글 작성하는 코드 */
  const handleSubmit = () => {
    if (!title.trim()) {
      setErrorMsg("제목을 입력해주세요");
      return;
    }
    if (!content.trim()) {
      setErrorMsg("내용을 입력해주세요");
      return;
    }

    createPostMutation.mutate(
      { title, content },
      {
        onSuccess: () => {
          setTitle("");
          setContent("");
          setShowModal(false);
        },
        onError: (error) => {
          console.error("게시글 작성 실패", error);
        },
      }
    );
  };

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Error loading posts</div>;
  }

  return (
    <>
      <div className=" min-h-screen flex justify-center items-center relative">
        <div className="w-[768px] h-full border-x-2 border-black flex flex-col items-center gap-4 justify-between overflow-auto px-2">
          <Navbar />
          <div className="w-full flex-1 mt-14 grid grid-cols-2 gap-2 overflow-auto">
            {posts?.map((post) => {
              return <PostCard key={post.id} post={post} onLike={handleLike} />;
            })}
          </div>
          <Footer />
          <button
            onClick={() => setShowModal(true)}
            className="fixed bottom-12 w-32 h-10 bg-rose-400 text-white rounded-md"
            style={{ right: "calc(50% - 384px + 12px)" }}
          >
            게시글 만들기
          </button>
          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-30">
              <div
                ref={modalRef}
                className="bg-white p-8 rounded shadow-lg w-96"
              >
                <h2 className="text-xl mb-4">게시글 작성하기</h2>
                {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
                <div>
                  <label className="block mb-2">제목</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                  />
                </div>
                <div>
                  <label className="block mb-2">내용</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border rounded mb-4 resize-none"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    취소하기
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-rose-400 text-white rounded"
                  >
                    작성하기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
