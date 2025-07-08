const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
const popup = document.getElementById("popup");
const moveAudio = new Audio("/sounds/move.mp3");
const winAudio = new Audio("/sounds/win.mp3");
const loseAudio = new Audio("/sounds/lose.mp3");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;
let gameEnded = false;
let legalMoves = [];

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";

  board.forEach((row, rowindex) => {
    row.forEach((square, squareindex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
      );

      squareElement.dataset.row = rowindex;
      squareElement.dataset.col = squareindex;

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );
        pieceElement.innerText = getPieceUnicode(square);
        pieceElement.draggable = !gameEnded && playerRole === square.color;

        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowindex, col: squareindex };
            e.dataTransfer.setData("text/plain", "");
            highlightLegalMoves(sourceSquare);
          }
        });

        pieceElement.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
          clearHighlights();
        });

        squareElement.appendChild(pieceElement);
      }

      squareElement.addEventListener("dragover", (e) => e.preventDefault());

      squareElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPiece) {
          const target = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
          };
          handleMove(sourceSquare, target);
        }
      });

      boardElement.appendChild(squareElement);
    });
  });

  if (playerRole === "b") boardElement.classList.add("flipped");
  else boardElement.classList.remove("flipped");

  if (!gameEnded && playerRole === chess.turn()) {
    showToast("Your turn");
  }
};

const highlightLegalMoves = (from) => {
  const fromSquare = `${String.fromCharCode(97 + from.col)}${8 - from.row}`;
  legalMoves = chess.moves({ square: fromSquare, verbose: true });
  legalMoves.forEach((move) => {
    const col = move.to.charCodeAt(0) - 97;
    const row = 8 - parseInt(move.to[1]);
    const target = boardElement.querySelector(`.square[data-row='${row}'][data-col='${col}']`);
    const marker = document.createElement("div");
    marker.classList.add("marker");
    target.appendChild(marker);
  });
};

const clearHighlights = () => {
  document.querySelectorAll(".marker").forEach((m) => m.remove());
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q",
  };
  socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
  const unicodePieces = {
    p: "♟",
    r: "♜",
    n: "♞",
    b: "♝",
    q: "♛",
    k: "♚",
    P: "♙",
    R: "♖",
    N: "♘",
    B: "♗",
    Q: "♕",
    K: "♔",
  };
  return unicodePieces[piece.type] || "";
};

const showToast = (text) => {
  popup.innerText = text;
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 3000);
};

socket.on("playerRole", function (role) {
  playerRole = role;
  showToast(`You are playing as ${role === "w" ? "White" : "Black"}`);
  renderBoard();
  socket.emit("checkOtherPlayer");
});

socket.on("waiting", function () {
  showToast("Waiting for the other player to join...");
});

socket.on("gameStart", function (message) {
  showToast(message);
});

socket.on("spectatorRole", function () {
  playerRole = null;
  showToast("You are watching as a spectator.");
  renderBoard();
});

socket.on("boardState", function (fen) {
  chess.load(fen);
  renderBoard();
});

socket.on("move", function (move) {
  chess.move(move);
  moveAudio.play();
  renderBoard();
});

socket.on("gameOver", function ({ winner }) {
  gameEnded = true;
  if (winner === playerRole) {
    showToast("You won!");
    winAudio.play();
  } else if (winner === null) {
    showToast("Game drawn");
  } else {
    showToast("You lost");
    loseAudio.play();
  }
});

socket.on("check", function (msg) {
  showToast(msg);
});

renderBoard();
