import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getAPI, postAPI } from "src/axios";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

/* 타입 지정 */
interface ChatRoom {
  _id: string;
  title: string;
  password: string;
  maxMembers: number;
}

interface ChatRoomData {
  title: string;
  password: string;
  maxMembers: string;
}

/* API 요청을 통해 채팅방 목록 가져오는 코드 */
const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await getAPI("/api/chats/rooms");
  return response.data.rooms;
};

/* Chat 컴포넌트 */
function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [chatRoomData, setChatRoomData] = useState<ChatRoomData>({
    title: "",
    password: "",
    maxMembers: "",
  });

  const modalRef = useRef<HTMLDivElement | null>(null);

  /* 채팅방 가져와서 상태에 저장하는 코드 */
  const { data, isLoading, isError } = useQuery<ChatRoom[]>(
    "chatRooms",
    fetchChatRooms
  );

  useEffect(() => {
    if (data) {
      setChatRooms(data);
    }
  }, [data]);

  /* 채팅방 목록을 가져오는 소캣에(room 네임스페이스) 연결하는 코드 */
  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_SERVER_URL!}/room`, {
      path: "/socket.io",
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  /* 새로운 방이 생성됐을때 이벤트를 받고 추가하는 코드 */
  useEffect(() => {
    if (!socket) return;

    socket.on("newRoom", (newRoom: ChatRoom) => {
      setChatRooms((prevRooms: ChatRoom[]) => [...prevRooms, newRoom]);
    });

    return () => {
      socket.off("newRoom");
    };
  }, [socket, setChatRooms]);

  /* 채팅방 생성시 모달, input값들 관리하는 코드 */
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setChatRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleComplete = async (): Promise<void> => {
    try {
      await postAPI("/api/chats/rooms", chatRoomData);
      setChatRoomData({ title: "", password: "", maxMembers: "" });
      toggleModal();
    } catch (error) {
      console.error("채팅방 생성 중 오류가 발생했습니다.", error);
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent): void => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      toggleModal();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        toggleModal();
      }
    });

    return () => {
      document.removeEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Escape" && isModalOpen) {
          toggleModal();
        }
      });
    };
  }, [handleClickOutside, isModalOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

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
      <div className="h-screen min-h-screen flex justify-center items-center">
        <div className="w-[768px] h-full border-x-2 border-black flex flex-col items-center gap-4 justify-between overflow-auto px-2">
          <Navbar />
          <div className="w-full flex-1 mt-14 gap-2 overflow-auto">
            {chatRooms.map((room: any) => (
              <Link to={`/chat/${room._id}`} key={room._id}>
                <div className="flex h-10 items-center border-b-2 border-black">
                  {room.title}
                </div>
              </Link>
            ))}
          </div>
          <button
            className="fixed bottom-12 w-32 h-10 bg-rose-400 text-white rounded-md"
            style={{ right: "calc(50% - 384px + 12px)" }}
            onClick={toggleModal}
          >
            채팅방 만들기
          </button>
          {isModalOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-30">
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
