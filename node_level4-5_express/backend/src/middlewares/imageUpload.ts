import upload from '../config/multerConfig';

export const imageUpload = upload.single('image');
