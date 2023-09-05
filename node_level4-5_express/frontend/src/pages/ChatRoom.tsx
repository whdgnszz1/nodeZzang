import { useEffect, useState, memo } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import { useQuery } from "react-query";
import { getAPI } from "src/axios";

interface ExtendedSocket extends Socket {
  interval?: NodeJS.Timeout;
}

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

const Message = memo(({ message, isCurrentUser }: any) => {
  const formattedTime = formatTime(message.createdAt);
  if (isCurrentUser) {
    // 현재 유저의 메시지
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

function ChatRoom() {
  const { id } = useParams();
  const [socket, setSocket] = useState<ExtendedSocket | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [localChatHistory, setLocalChatHistory] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const fetchChatHistory = async () => {
    const response = await getAPI(`/api/chats/rooms/${id}`);
    return response.data.chats;
  };

  const { isLoading, isError } = useQuery(
    `chatHistory_${id}`,
    fetchChatHistory,
    {
      onSuccess: (data) => {
        setLocalChatHistory(data);
      },
    }
  );

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

  useEffect(() => {
    if (!socket) return;
    socket.on("receiveMessage", (message: any) => {
      setLocalChatHistory((prevHistory) => [...prevHistory, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  const user = JSON.parse(localStorage.getItem("user") as string);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }
  console.log(localChatHistory);
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
