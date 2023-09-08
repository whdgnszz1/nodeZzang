import { useState } from "react";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import PostCard from "src/components/PostCard";
import { useMutation, useQuery } from "react-query";
import useModal from "src/hooks/useModal";
import { createPost, getAllPosts } from "src/api/postAPI";

const Main = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const createPostModal = useModal();

  const {
    data: posts,
    refetch,
    error,
    isLoading,
    isError,
  } = useQuery("posts", getAllPosts);

  const createPostMutation = useMutation(createPost, {
    onSuccess: () => {
      refetch();
    },
  });

  const handleLike = () => {
    refetch();
  };

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
          createPostModal.closeModal();
        },
        onError: (error: any) => {
          console.error("게시글 작성 실패", error);
          if (error?.response?.status === 403) {
            alert("로그인이 필요한 기능입니다.");
            setTitle("");
            setContent("");
            createPostModal.closeModal();
          }
        },
      }
    );
  };

  if (isError) {
    console.error(error);
    return <div>Error</div>;
  }

  return (
    <>
      <div className="h-screen flex justify-center items-center relative">
        <div className="w-[768px] h-full  border-x-2 border-black  flex flex-col items-center gap-4 justify-between overflow-auto px-2 ">
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
            <div className="w-full flex-1 mt-14 grid grid-cols-2 gap-2 overflow-auto pb-12">
              {posts?.map((post) => {
                return (
                  <PostCard key={post.id} post={post} onLike={handleLike} />
                );
              })}
            </div>
          )}

          <Footer />
          <button
            onClick={() => createPostModal.openModal()}
            className="fixed bottom-12 w-32 h-10 bg-rose-400 text-white rounded-md"
            style={{ right: "calc(50% - 384px + 12px)" }}
          >
            게시글 만들기
          </button>
          {createPostModal.isOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-30">
              <div
                ref={createPostModal.modalRef}
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
                    onClick={() => createPostModal.closeModal()}
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
