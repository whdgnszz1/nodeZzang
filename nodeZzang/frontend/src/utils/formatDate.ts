export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${month}월 ${day}일 ${hours}시 ${minutes}분`;
};



export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";

  if (hours > 12) {
    hours -= 12;
  }

  return `${ampm} ${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
};