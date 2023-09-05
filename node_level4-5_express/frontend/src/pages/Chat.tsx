import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getAPI, postAPI } from "src/axios";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

interface ExtendedSocket extends Socket {
  interval?: NodeJS.Timeout;
}

function Chat() {
  const [socket, setSocket] = useState<ExtendedSocket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [chatRoomData, setChatRoomData] = useState({
    title: "",
    password: "",
    maxMembers: "",
  });

  const fetchChatRooms = async () => {
    const { data } = await getAPI("/api/chats/rooms");
    return data.rooms;
  };

  const { data, isLoading, isError } = useQuery("chatRooms", fetchChatRooms);
  useEffect(() => {
    if (data) {
      setChatRooms(data);
    }
  }, [data]);

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_SERVER_URL!}/room`, {
      path: "/socket.io",
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("newRoom", (newRoom) => {
      setChatRooms((prevRooms: any[]) => [...prevRooms, newRoom]);
    });

    return () => {
      socket.off("newRoom");
    };
  }, [socket, setChatRooms]);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChatRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleComplete = async () => {
    try {
      await postAPI("/api/chats/rooms", chatRoomData);
      setChatRoomData({ title: "", password: "", maxMembers: "" });
      toggleModal();
    } catch (error) {
      console.error("채팅방 생성 중 오류가 발생했습니다.", error);
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      toggleModal();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        toggleModal();
      }
    });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <div className=" h-screen flex justify-center items-center">
        <div className="relative w-[768px] h-[1000px] border-x-2 border-black flex flex-col items-center gap-4 justify-between overflow-auto px-2">
          <Navbar />
          <div className="w-full h-full flex flex-col mt-4">
            {chatRooms.map((room: any) => (
              <Link to={`/chat/${room._id}`} key={room._id}>
                <div className="flex h-10 items-center border-b-2 border-black">
                  {room.title}
                </div>
              </Link>
            ))}
          </div>
          <button
            className="absolute bottom-10 right-10 w-32 h-10 bg-rose-400 text-white rounded-md"
            onClick={toggleModal}
          >
            채팅방 만들기
          </button>
          {isModalOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-10">
              <div ref={modalRef} className=" bg-white p-5 rounded-md">
                <h2 className="mb-4 w-96">채팅방 만들기</h2>
                <div className="mb-4">
                  <label className="block mb-2">채팅방 제목</label>
                  <input
                    type="text"
                    name="title"
                    className="border p-2 w-full"
                    placeholder="채팅방 제목"
                    onChange={handleChange}
                    value={chatRoomData.title}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">비밀번호</label>
                  <input
                    type="password"
                    name="password"
                    className="border p-2 w-full"
                    placeholder="비밀번호"
                    onChange={handleChange}
                    value={chatRoomData.password}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">최대 인원</label>
                  <input
                    type="number"
                    name="maxMembers"
                    className="border p-2 w-full"
                    placeholder="최대 인원"
                    onChange={handleChange}
                    value={chatRoomData.maxMembers}
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={handleComplete}
                    className="bg-rose-500 text-white p-2 rounded-md"
                  >
                    완료
                  </button>
                  <button
                    onClick={toggleModal}
                    className="bg-gray-400 text-white p-2 rounded-md"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Chat;
