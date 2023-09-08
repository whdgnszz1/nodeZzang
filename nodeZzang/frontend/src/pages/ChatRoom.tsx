import { useEffect, useState, memo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import { postAPI } from "src/axios";
import { ChatMessage, MessageProps } from "src/types/chatType";
import { User } from "src/types/userType";
import { formatTime } from "src/utils/formatDate";

/* 타입 정의 */

interface ProfileImageProps {
  profileUrl: string | undefined;
}

// 채팅에 들어갈 이미지 컴포넌트
const ProfileImage: React.FC<ProfileImageProps> = ({ profileUrl }) => (
  <img
    src={
      profileUrl ? profileUrl : process.env.PUBLIC_URL + "/assets/default.png"
    }
    alt="user profile"
    className="rounded-full w-8 h-8 self-center"
  />
);

/* memo를 사용해 채팅을 캐싱 */
const Message = memo(({ message, isCurrentUser }: MessageProps) => {
  const formattedTime = formatTime(message.createdAt);
  if (isCurrentUser) {
    return (
      <div className="flex justify-end my-2 max-w-3/5">
        <div>
          <div className="text-xs text-end">{message.nickname}</div>
          <div className="flex gap-1">
            <div className="ml-auto text-xs  flex items-end pb-[1px]">
              {formattedTime}
            </div>
            <div className="p-2 rounded-lg bg-blue-400 text-white flex">
              <div className="mx-1">{message.message}</div>
            </div>
          </div>
        </div>
        <ProfileImage profileUrl={message.profileUrl} />
      </div>
    );
  } else {
    // 타 유저의 메시지
    return (
      <div className="flex justify-start my-2 max-w-3/5">
        <ProfileImage profileUrl={message.profileUrl} />

        <div>
          <div className="text-xs">{message.nickname}</div>
          <div className="flex gap-1">
            <div className="p-2 rounded-lg bg-gray-200 text-black flex items-start">
              <div className="mx-1">{message.message}</div>
            </div>
            <div className="ml-auto text-xs flex items-end pb-[1px]">
              {formattedTime}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

/* 기존 채팅 가져오는 코드 */
const fetchChatHistory = async (roomId: string): Promise<ChatMessage[]> => {
  const response = await postAPI(`/api/chats/rooms/${roomId}`, {});
  return response.data.chats;
};

/* 컴포넌트 */
function ChatRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [localChatHistory, setLocalChatHistory] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const initialUser = JSON.parse(localStorage.getItem("user") as string);
  const [user] = useState<User>(initialUser || {});

  // 소켓을 통해 받은 메시지를 localChatHistory 상태에 추가하는 함수
  const addReceivedMessage = (message: ChatMessage) => {
    setLocalChatHistory((prevHistory) => [message, ...prevHistory]);
  };

  // 스크롤을 채팅의 가장 최근 메시지 위치로 이동시키는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 방 ID가 변경될 때, 채팅 기록을 불러오고 소켓 연결을 시작하는 useEffect
  useEffect(() => {
    const fetchAndSetChatHistory = async (roomId: string) => {
      try {
        const data = await fetchChatHistory(roomId);
        setLocalChatHistory(data);
      } catch (error: any) {
        console.error(error);
        if (error?.response?.status === 403) {
          alert("로그인이 필요한 페이지입니다.");
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchAndSetChatHistory(id);

    const newSocket = io(`${process.env.REACT_APP_SERVER_URL!}/chat`, {
      path: "/socket.io",
    });
    newSocket.emit("join", id);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [id, navigate]);

  // 소켓 상태가 변경될 때, 메시지 수신 리스너를 설정하는 useEffect
  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", addReceivedMessage);

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  // 채팅 기록(localChatHistory)이 변경될 때, 스크롤을 최신 메시지로 이동시키는 useEffect
  useEffect(scrollToBottom, [localChatHistory]);

  const handleSend = () => {
    if (socket && messageInput.trim()) {
      const user = JSON.parse(localStorage.getItem("user") as string);
      const now = new Date();

      socket.emit("sendMessage", {
        message: messageInput,
        roomId: id,
        userId: user.userId,
        nickname: user.nickname,
        profileUrl: user.profileUrl,
        createdAt: now.toISOString(),
      });

      setMessageInput("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="h-screen min-h-screen flex justify-center items-center">
      <div
        ref={messagesEndRef}
        className="w-[768px] h-full border-x-2 border-black flex flex-col items-center gap-4 justify-between overflow-auto px-2"
      >
        <Navbar />
        {isLoading ? (
          <div className="w-screen h-screen flex justify-center items-center">
            <img
              src={process.env.PUBLIC_URL + "/assets/loading.gif"}
              alt="loading_spinner"
            />
          </div>
        ) : (
          <div className="w-full mt-16">
            {[...localChatHistory]
              .reverse()
              .map((message: any, idx: number) => (
                <Message
                  key={idx}
                  message={message}
                  isCurrentUser={message.userId === user.userId}
                />
              ))}
            <div ref={messagesEndRef}></div>
          </div>
        )}
        <div className="w-full flex mb-12">
          <input
            type="text"
            value={messageInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력해주세요."
            className="border p-2 rounded w-11/12 mr-4"
          />
          <button
            onClick={handleSend}
            className="bg-rose-400 w-1/12 text-white p-2 rounded"
          >
            보내기
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ChatRoom;
