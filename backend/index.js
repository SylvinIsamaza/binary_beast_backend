const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const soccerData = require("../scrape/soccer");

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with the actual domain of your frontend
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json()); // Add body parsing middleware

// Define your socket.io event handlers
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("get-skydata", async () => {
    const data = await soccerData(); // Fetch data
    
    socket.emit("receive-data", data); // Emit data to the client
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Define your API route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log("username >>> ", username);
  console.log("password >>> ", password);
  res.send({ data: username });
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
