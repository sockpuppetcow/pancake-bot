console.log("Pancake Bot launch wrapper started.");

var fork = require("child_process").fork;

var child = fork("./bot.js");

function startChild() {
	child.on("exit", function(status, signal) {
		console.log("Bot stopped with status code " + status);
		if (status) {
			child = fork("./bot.js");
			startChild();
		}
	});
}

startChild();
