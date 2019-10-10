var fs = require('fs');
var path = require("path");
const Discord = require("discord.js");

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
						//TODO: Register commands
				
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
	modules: {},
	commands: {}
};




//Discord stuff

var token = fs.readFileSync('token.txt', 'utf8');
token = token.replace(/\r|\n/g, "")
bot.client.on("ready", function() {
	loadBotModules();
	console.log("Hi, I'm Pancake!");
});

bot.client.login(token);
