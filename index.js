const express = require("express");
const cors = require("cors");

const { createServer } = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
require("./config/database");

const Document = require("./models/document");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`Socket connected on ${socket.id}`);

  socket.on("joinRoom", (id) => {
    socket.join(id);
    console.log(`Joined room ${id}`);
  });

  socket.on("textChange", async (data) => {
    const docs = await Document.findByIdAndUpdate(
      data.id,
      { content: data.value },
      { new: true }
    );
    io.to(data.id).emit("updatedContent", docs.content);
  });
});

app.use(express.json());
app.use(cors());

app.use("/", require("./routes/index"));

const port = process.env.PORT;
httpServer.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
