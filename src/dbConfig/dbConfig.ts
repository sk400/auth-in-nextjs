import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.log("Error connecting to MongoDB:", err);
      process.exit();
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

export default connectToDB;
