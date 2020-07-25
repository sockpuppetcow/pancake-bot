//Pancake Bot Database Test Module
var bot;

module.exports = {
	config: {
		name: "Emoji Importer"
	},
	commands: {
		eimport: {
			exec: function(msg, args) {
				var manager = msg.guild.emojis;

				for (var i = 0; i < args.length; i++) {
					var split = args[i].split(":");
					if (split[0] == args[i]) {
						console.log(args[i] + " is not a custom emoji, skipping...");
						continue;
					}
					
					var id = split[2].slice(0,-1);	//Trim off the hanging &gt;

					var check = manager.resolve(id);
					if (check != null || check != undefined) {
						console.log(args[i] + " is from this guild, skipping...");
						continue;
					}

					var extension = ".png"; //Assume non-animated.

					if (split[0] == "<a") {	//Fix it if it's animated.
						extension = ".gif";
					}

					var name = split[1];

					var url = "https://cdn.discordapp.com/emojis/" + id + extension;

					//If we've come this far, we should be good to go.

					manager.create(url, name).then(function(emoji) {
						msg.react(emoji);
					}).catch(function(error) {
						console.log("Error while importing " + args[i]);
						console.error(error);
					});
				}

			},
			perm: "MANAGE_EMOJIS"
		}
	},
	events: {},
	init: function(m_bot) {
		bot = m_bot;
		console.log("[Emoji Importer] Initializing");
	}
}

