import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { code, name } = err;
  if (code === 11000 && name === "MongoServerError") {
    res.status(409).json({ message: "Email in use" });
    return;
  }

  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
