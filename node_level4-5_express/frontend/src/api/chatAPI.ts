import { getAPI, postAPI } from "src/axios";
import { ChatRoom, ChatRoomData } from "src/types/chatType";

export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await getAPI("/api/chats/rooms");
  return response.data.rooms;
};

export const createChatRoom = async (chatRoomData: ChatRoomData) => {
  try {
    const response = await postAPI("/api/chats/rooms", chatRoomData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkRoomPassword = async (roomId: string, password: string) => {
  try {
    const response = await postAPI(`/api/chats/rooms/${roomId}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
