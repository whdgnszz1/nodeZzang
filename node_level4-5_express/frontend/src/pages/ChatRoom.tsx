import { useEffect, useState, memo } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import { useQuery } from "react-query";
import { getAPI } from "src/axios";

/* 타입 정의 */
interface MessageProps {
  message: {
    message: string;
    createdAt: string;
    nickname: string;
    userId: string;
  };
  isCurrentUser: boolean;
}

interface ChatMessage {
  message: string;
  createdAt: string;
  nickname: string;
  userId: string;
}

interface User {
  userId: string;
  nickname: string;
}

/* 시간 바꿔주는 함수 */
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";

  if (hours > 12) {
    hours -= 12;
  }

  return `${ampm} ${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
};

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
        <img
          src={process.env.PUBLIC_URL + "/assets/default.png"}
          alt="user profile"
          className="ml-2 rounded-full w-8 h-8 self-center"
        />
      </div>
    );
  } else {
    // 타 유저의 메시지
    return (
      <div className="flex justify-start my-2 max-w-3/5">
        <img
          src={process.env.PUBLIC_URL + "/assets/default.png"}
          alt="user profile"
          className="mr-2 rounded-full w-8 h-8 self-center"
        />
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
  const response = await getAPI(`/api/chats/rooms/${roomId}`);
  return response.data.chats;
};

/* 컴포넌트 */
function ChatRoom() {
  const user: User = JSON.parse(localStorage.getItem("user") as string);
  const { id } = useParams<{ id: string }>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [localChatHistory, setLocalChatHistory] = useState<ChatMessage[]>([]);

  const { isLoading, isError } = useQuery(
    `chatHistory_${id}`,
    () => fetchChatHistory(id as string),
    {
      onSuccess: (data) => {
        setLocalChatHistory(data);
      },
    }
  );

  /* chat 네임스페이스에 socket연결 후 /:id의 채팅방에 join */

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_SERVER_URL!}/chat`, {
      path: "/socket.io",
    });
    newSocket.emit("join", id);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  /* 채팅 전송하는 코드 */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (socket && messageInput.trim()) {
      const user = JSON.parse(localStorage.getItem("user") as string);
      const now = new Date();

      socket.emit("sendMessage", {
        message: messageInput,
        roomId: id,
        userId: user.userId,
        nickname: user.nickname,
        createdAt: now.toISOString(),
      });

      setMessageInput("");
    }
  };

  /* 다른사람이 채팅 보냈을때 receiveMessage 받는 코드 */
  useEffect(() => {
    if (!socket) return;
    socket.on("receiveMessage", (message: ChatMessage) => {
      setLocalChatHistory((prevHistory) => [...prevHistory, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-[768px] h-[1000px] border-x-2 border-black flex flex-col items-center gap-4 justify-between overflow-auto px-2">
        <Navbar />
        <div className="w-full mt-6 flex flex-col-reverse">
          {[...localChatHistory].reverse().map((message: any, idx: number) => (
            <Message
              key={idx}
              message={message}
              isCurrentUser={message.userId === user.userId}
            />
          ))}
        </div>
        <div className="w-full flex mb-6">
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
