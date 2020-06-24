var fs = require('fs');
var path = require("path");
const sqlite3 = require('better-sqlite3');
var db;
const Discord = require("discord.js");

function connectDatabase() {
	//TODO: Get some error checking on this, it is file IO after all.
	console.log("Connecting to database.");

	db = new sqlite3('./pancake.sqlite', {verbose: console.log});
	bot.database = db;
}

function loadBotModules() {
	console.log("Loading modules from directory: " + bot.config.modulesPath);
	fs.readdir(bot.config.modulesPath, function(err, files) {
		if (err) {
			console.log("Error while loading modules: " + err);
			return;
		}

		files.forEach(function(f, index) {
			var modPath = "./" + path.join(bot.config.modulesPath, f);
			var modStat = fs.stat(modPath, function(err, stats) {
				if (stats.isFile()) {
					if (path.extname(modPath) === ".js") {
						var temp = require(modPath);
						bot.modules[temp.config.name] = temp;
						//Register commands
						for (key in temp.commands) {
							if (!bot.commands[key]) {
								bot.commands[key] = temp.commands[key];
							} else {
								console.log("Command collision detected from module " + temp.config.name + ". " + temp.commands[key] + " already exists. Command blocked.");
							}
						}

						//Register events
						//TODO: Make this instead delegate to a handler which will track what module is doing what
						for (key in temp.events) {
							bot.client.on(key, temp.events[key]);
						}

						bot.modules[temp.config.name].init(bot);	
					}
				}
			});
		});
	});
}

var bot = {
	config: {
		modulesPath: './modules'
	},
	client: new Discord.Client(),
	database: db,
	modules: {},
	commands: {}
};

//Execute commands
bot.client.on("message", function(msg) {
	if (msg.content.startsWith("!")) {
		var split = msg.content.split(" ");
		var cmd = split[0].substring(1).toLowerCase();
		var com = bot.commands[cmd];
		if (com) {
			let allowed = false;
			console.log(com.perm);
			if (com.perm == null || com.perm == undefined || com.perm == "") {
				allowed = true;
			} else {
				//We care about permissions.
				if (msg.member.permissions.has(com.perm)) {
					allowed = true;
				}
			}

			if (allowed) {
				var args = split.shift();
				com.exec(msg,args);
			}
		}
	}
});

//Discord stuff

var token = fs.readFileSync('token.txt', 'utf8');
token = token.replace(/\r|\n/g, "")
bot.client.on("ready", function() {
	connectDatabase();
	loadBotModules();
	console.log("Hi, I'm Pancake!");
	console.log(bot.commands);
});

bot.client.login(token);
