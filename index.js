import dotenv from "dotenv";
import { Server } from "socket.io";

import printBoard from "./helpers/printboard.js";
import isGameOver from "./helpers/isGameOver.js";

dotenv.config();
//array for player
var player = [];

//socket.io server
const io = new Server(process.env.PORT);

//socket connection
io.on("connection", (socket) => {
  //new players id
  var id = socket.id;

  console.log("new player connected " + id);
  //adding players to array
  player.push(socket);

  //game start when two player joins server
  if (player.length == 2) {
    //roles for player eg 0===X and 1===O
    var roleid = 0;

    //tic tac toe board
    var board = {
      1: "-",
      2: "-",
      3: "-",
      4: "-",
      5: "-",
      6: "-",
      7: "-",
      8: "-",
      9: "-",
    };

    console.log("\n2 player joined");

    //send welcome message to both client
    io.sockets
      .to(player[0].id)
      .emit("Game Start", "\nGame started. You are the first player.");
    io.sockets
      .to(player[1].id)
      .emit("Game Start", "\nGame started. You are the second player.");

    //this function run when first player enter input
    player[0].on("move", function (data) {
      // check if the move is valid & update board

      if (checkMove(data.player, roleid, data.move, board)) {
        //updating board
        if (data.player == 0) {
          board[data.move] = "x";
          roleid = 1;
        } else {
          board[data.move] = "o";
          roleid = 0;
        }

        //printing board  at server side
        printBoard(board);
        //send move to client side
        io.sockets.emit("Move is accepted", board);
        //check if game is over
        var status = isGameOver(board);
        //check for game is tie or not
        if (status == 2) {
          console.log("Tie");
          io.sockets.emit("Tie", "Game is tied");
        }
        //check for winner
        if (status == 0) {
          console.log("player win");
          io.sockets.emit("Game End", "Game won by first player");
        }
      }
    });

    //this function run when second player enter input
    player[1].on("move", function (data) {
      // check if the move is valid & update board
      if (checkMove(data.player, roleid, data.move, board)) {
        //updating board
        if (data.player == 0) {
          board[data.move] = "x";
          roleid = 1;
        } else {
          board[data.move] = "o";
          roleid = 0;
        }
        //printing board  at server side
        printBoard(board);
        //send move to client side
        io.sockets.emit("Move is accepted", board);
        //check if game is over
        var status = isGameOver(board);
        //check for game is tie or not
        if (status == 2) {
          console.log("tie");
          io.sockets.emit("tie", "Match Tie");
        }
        //check for winner
        if (status == 0) {
          console.log("player win");
          io.sockets.emit("GE", "Game won by second player");
        }
      }
    });
  } else {
    socket.emit("waiting", "\nwaiting for player 2");
    console.log("waiting for player 2");
  }

  //disconnect function
  socket.on("disconnect", () => {
    console.log("player disconnected ID: ", id);
    //remove id from player array
    player.pop(id);
    //send player is disconnected to client side
    io.sockets.emit("player disconnected", id);
  });
});

//checking the move
function checkMove(playerId, roleId, move, board) {
  console.log(playerId);
  console.log(roleId);
  if (playerId == roleId && move <= 9 && board[move] == "-") {
    return 1;
  } else if (playerId !== roleId) {
    //send message to specific client
    io.sockets.to(player[playerId].id).emit("Not your turn", "Not your turn");
  } else if (board[move] !== undefined) {
    //send message to specific client
    io.sockets
      .to(player[playerId].id)
      .emit(
        "Move is already occupied",
        "move is already occupied, please try another"
      );
  }
  return 0;
}
