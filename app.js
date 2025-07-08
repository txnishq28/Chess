const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

let chess = new Chess();
let players = {};

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Checkmate" });
});

io.on("connection", (socket) => {
  if (!players.white) {
    players.white = socket.id;
    socket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = socket.id;
    socket.emit("playerRole", "b");
  } else {
    socket.emit("spectatorRole");
  }

  socket.emit("boardState", chess.fen());

  if (players.white && players.black) {
    io.emit("gameStart", "Both players connected. White starts the game.");
  }

  socket.on("checkOtherPlayer", () => {
    if (!(players.white && players.black)) {
      socket.emit("waiting");
    }
  });

  socket.on("move", (move) => {
    const currentTurn = chess.turn();
    const playerColor = socket.id === players.white ? "w" : (socket.id === players.black ? "b" : null);

    if (currentTurn !== playerColor) return;

    try {
      const result = chess.move(move);
      if (result) {
        io.emit("move", move);
        io.emit("boardState", chess.fen());

        if (chess.inCheck()) {
          const msg = `${chess.turn() === "w" ? "White" : "Black"} king is in check!`;
          io.emit("check", msg);
        }

        if (chess.isGameOver()) {
          let winner = null;
          if (chess.isCheckmate()) {
            winner = chess.turn() === "w" ? "b" : "w";
          }
          io.emit("gameOver", { winner });
        }
      } else {
        socket.emit("invalidMove", move);
      }
    } catch (err) {
      socket.emit("invalidMove", move);
    }
  });

  socket.on("rematch", () => {
    chess.reset();
    io.emit("boardState", chess.fen());
  });

  socket.on("boardStateRequest", () => {
    socket.emit("boardState", chess.fen());
  });

  socket.on("disconnect", () => {
    if (socket.id === players.white) delete players.white;
    if (socket.id === players.black) delete players.black;
  });
});

server.listen(3001, () => console.log("listening on port 3001"));
