import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";

interface ExtendedSocket extends Socket {
  interval?: NodeJS.Timeout; // interval might be a NodeJS timer, adjust the type as needed
}

function Chat() {
  const [socket, setSocket] = useState<ExtendedSocket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL!, {
      path: "/socket.io",
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // socket.on("news", (data) => {
    //   console.log(data);
    // });

    // socket.interval = setInterval(() => {
    //   socket.emit("reply", "helloserver");
    // }, 3000);

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  
  return (
    <>
      <div className=" h-screen flex justify-center items-center">
        <div className="w-[768px] h-[1000px] border-x-2 border-black flex flex-col items-center gap-4 justify-between overflow-auto px-2">
          <Navbar />
          <div className="w-full h-full flex flex-col mt-6 gap-2">
            <div>채팅방1</div>
            <div>채팅방2</div>
            <div>채팅방3</div>
            <div>채팅방4</div>
            <div>채팅방5</div>
            <div>채팅방6</div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Chat;
