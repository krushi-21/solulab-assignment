import { io } from "socket.io-client";

import printBoard from "../helpers/printboard.js";
import readmove from "../helpers/readMove.js";
const socket = io("http://localhost:5050");

var player;

socket.on("connect", () => {
  console.log(`\nwelcome to tic tac toe game  id : ${socket.id}`);
  socket.on("Game Start", (data) => {
    console.log(data);

    //checking which user is first by servers message
    if (data.includes("first")) {
      player = 0;
    } else {
      player = 1;
    }
    //reading players move here
    readmove(socket, player);
  });
});
//when move is accepted by server this function runs
socket.on("Move is accepted", function (board) {
  printBoard(board);
});
//waiting message
socket.on("waiting", (data) => {
  console.log(data);
});

//function runs when move is occupied
socket.on("Move is already occupied", (data) => {
  console.log(data);
});

socket.on("Game End", (data) => {
  console.log(data);
  process.exit(0);
});

socket.on("Tie", (data) => {
  console.log(data);
  process.exit(0);
});

socket.on("Not your turn", (data) => {
  console.log(data);
});

//when one player disconnect the game this function will run
socket.on("player disconnected", () => {
  console.log("opponent disconnected you win the match");
  process.exit(0);
});
