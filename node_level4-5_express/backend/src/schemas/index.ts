import mongoose from "mongoose";

export const connectMongoDB = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  mongoose.connect(process.env.MONGODB_URI!, {
    dbName: "node_level4-5_express",
  })
  .then(() => {
    console.log("몽고디비 연결 성공");
  })
  .catch(error => {
    console.log("몽고디비 연결 에러", error);
  });
};

