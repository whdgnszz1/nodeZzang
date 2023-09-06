import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import useModal from "src/hooks/useModal";
import { ChatRoom, ChatRoomData } from "src/types/chatType";
import {
  checkRoomPassword,
  createChatRoom,
  fetchChatRooms,
} from "src/api/chatAPI";

function Chat() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [chatRoomData, setChatRoomData] = useState<ChatRoomData>({
    title: "",
    password: "",
    maxMembers: "",
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [roomPassword, setRoomPassword] = useState<string>("");
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const createChatRoomModal = useModal();
  const passwordModal = useModal();

  /* 비밀번호 모달 핸들러 */
  const handleRoomClick = (roomId: string, password?: string) => {
    setSelectedRoomId(roomId);
    if (password) {
      passwordModal.openModal();
    } else {
      navigate(`/chat/${roomId}`);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomPassword(e.target.value);
  };

  const handlePasswordSubmit = async () => {
    if (!selectedRoomId) return;

    try {
      const result = await checkRoomPassword(selectedRoomId, roomPassword);

      if (result.data.redirectTo) {
        navigate(result.data.redirectTo);
      }
    } catch (error: any) {
      console.error("비밀번호 확인 중 오류 발생", error);
      if (error?.response?.status === 403) {
        alert("로그인이 필요한 기능입니다.");
        navigate("/");
      }
    } finally {
      setRoomPassword("");
      passwordModal.closeModal();
    }
  };

  useEffect(() => {
    if (passwordModal.isOpen && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [passwordModal.isOpen]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setChatRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleComplete = async (): Promise<void> => {
    if (Number(chatRoomData.maxMembers) < 2) {
      alert("최대 인원은 2명 이상이어야 합니다.");
      return;
    }

    try {
      await createChatRoom(chatRoomData);
      setChatRoomData({ title: "", password: "", maxMembers: "" });
      createChatRoomModal.closeModal();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert("로그인이 필요한 기능입니다.");
        navigate("/");
      }
      console.error("채팅방 생성 중 오류가 발생했습니다.", error);
    }
  };

  if (isError) {
    return <div>Error</div>;
  }
  
  return (
    <>
      <div className="h-screen min-h-screen flex justify-center items-center">
        <div className="w-[768px] h-full border-x-2 border-black flex flex-col items-center gap-4 justify-between overflow-auto px-2">
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
            <>
              <div className="w-full flex-1 mt-14 gap-2 overflow-auto">
                {chatRooms.map((room: ChatRoom) => (
                  <div
                    onClick={() => handleRoomClick(room._id, room.password)}
                    className="flex h-10 items-center border-b-2 border-black"
                  >
                    <span>
                      {room.password ? <AiOutlineLock /> : <AiOutlineUnlock />}
                    </span>
                    <Link to={`/chat/${room._id}`} key={room._id}>
                      {room.title}
                    </Link>
                  </div>
                ))}
              </div>
              <button
                className="fixed bottom-12 w-32 h-10 bg-rose-400 text-white rounded-md"
                style={{ right: "calc(50% - 384px + 12px)" }}
                onClick={createChatRoomModal.openModal}
              >
                채팅방 만들기
              </button>
            </>
          )}

          {createChatRoomModal.isOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-30">
              <div
                ref={createChatRoomModal.modalRef}
                className=" bg-white p-5 rounded-md"
              >
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
                    min="2"
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
                    onClick={createChatRoomModal.closeModal}
                    className="bg-gray-400 text-white p-2 rounded-md"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}
          <Footer />

          {passwordModal.isOpen && (
            <div
              ref={passwordModal.modalRef}
              className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-30"
            >
              <div className="bg-white p-5 rounded-md w-96 h-52 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex justify-center items-center">
                    채팅방 비밀번호 입력
                  </div>
                  <button
                    onClick={() => passwordModal.closeModal()}
                    className="   text-black rounded-full"
                  >
                    X
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center pl-1">비밀번호</div>
                  <input
                    type="password"
                    ref={passwordInputRef}
                    className="border p-2 w-full focus:border-black focus:outline-none"
                    placeholder="비밀번호 입력"
                    onChange={handlePasswordChange}
                    value={roomPassword}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handlePasswordSubmit}
                    className=" bg-rose-400 text-white px-2 py-1 rounded-md"
                  >
                    입장
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
