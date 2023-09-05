import { useState } from "react";
import { TbPhotoUp } from "react-icons/tb";
import { putAPI } from "src/axios";

function EditProfileModal({ isOpen, onClose, user, onUserUpdate }: any) {
  const [nickname, setNickname] = useState(user.nickname);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImageURL, setPreviewImageURL] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const imageURL = URL.createObjectURL(file);
      setPreviewImageURL(imageURL);
    }
  };

  const handleClose = () => {
    setPreviewImageURL(null);
    onClose();
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("nickname", nickname);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const result = await putAPI("/api/profile", formData);
      const userInfo = {
        userId: result.data.userId,
        nickname: result.data.nickname,
        profileUrl: result.data.profileUrl,
      };

      localStorage.setItem("user", JSON.stringify(userInfo));
      setPreviewImageURL(null);
      onUserUpdate(userInfo);
      onClose();
    } catch (error) {
      console.error("이미지 업로드에 실패하였습니다.", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded relative w-[400px] h-[400px] modal-content flex flex-col">
          <div
            className="absolute top-2 right-3 cursor-pointer"
            onClick={handleClose}
          >
            X
          </div>

          <div className="flex justify-center items-center mb-4 h-[200px] relative cursor-pointer">
            {previewImageURL ? (
              <img
                src={previewImageURL}
                alt="Selected"
                className="max-h-[160px] max-w-[160px] rounded-full"
              />
            ) : (
              <TbPhotoUp size={160} />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>

          <div className="my-4">
            <label className="block mb-2 ml-1">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="border p-2 w-full rounded-md"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-rose-400 text-white p-2 rounded"
          >
            수정완료
          </button>
        </div>
      </div>
    )
  );
}

export default EditProfileModal;
