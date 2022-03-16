import readcommand from "readcommand";

export default function readmove(socket, player) {
  var sigints = 0;
  readcommand.loop(function (err, args, str, next) {
    if (err && err.code !== "SIGINT") {
      throw err;
    } else if (err) {
      if (sigints === 1) {
        process.exit(0);
      } else {
        sigints++;
        console.log("Press ^C again to exit.");
        return next();
      }
    } else if (args[0] === "r") {
      process.exit(0);
    } else {
      sigints = 0;
    }

    socket.emit("move", {
      player: player,
      move: args[0],
    });
    return next();
  });
}
