import { useState } from "react";
import { getAPI, postAPI } from "src/axios";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import PostCard from "src/components/PostCard";
import { useMutation, useQuery } from "react-query";

const fetchPosts = async () => {
  const response = await getAPI("/api/posts");
  return response.data.posts;
};

const Main = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    data: posts,
    refetch,
    error,
    isLoading,
    isError,
  } = useQuery("posts", fetchPosts);

  const mutation = useMutation(
    (newPost: { title: string; content: string }) =>
      postAPI("/api/posts", newPost),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const handleLike = () => {
    refetch();
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrorMsg("제목을 입력해주세요");
      return;
    }
    if (!content.trim()) {
      setErrorMsg("내용을 입력해주세요");
      return;
    }

    try {
      await mutation.mutateAsync({ title, content });
      setTitle("");
      setContent("");
      setShowModal(false);
    } catch (error) {
      console.error("게시글 작성 실패", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Error loading posts</div>;
  }

  return (
    <>
      <div className=" h-screen flex justify-center items-center">
      <div className="relative w-[768px] h-[1000px] border-x-2 border-black flex flex-col items-center gap-4 justify-between overflow-auto px-2">
          <Navbar />
          <div className="w-full h-full grid grid-cols-2 mt-6 gap-2">
            {posts.map((post: any, i: number) => {
              return <PostCard key={i} post={post} onLike={handleLike} />;
            })}
          </div>
          <Footer />
          {showModal && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40">
              <div className="bg-white p-8 rounded shadow-lg w-96">
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

          <button
            onClick={() => setShowModal(true)}
            className="absolute bottom-10 right-10 w-32 h-10 bg-rose-400 text-white rounded-md"
          >
            게시글 만들기
          </button>
        </div>
      </div>
    </>
  );
};

export default Main;
