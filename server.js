import mongoose from "mongoose";
import app from "./app.js";

const startServer = async () => {
  await mongoose
    .connect(process.env.DB_HOST)
    .then(() => {
      app.listen(process.env.PORT, () => {
        console.log("Database connection successful");
        console.log(
          `Server is running. Use our API on port: ${process.env.PORT}`
        );
      });
    })
    .catch((error) => {
      console.log("Database connect unsuccessfully");
      console.error(error.message);
      process.exit(1);
    });
};

await startServer();
