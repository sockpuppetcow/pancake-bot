//Pancake Bot Module Template
var bot;

module.exports = {
	config: {
		name: "Statusizer"
	},
	commands: {
		play: {
			exec: function(msg, args) {
				bot.client.user.setActivity(args.join(" "), {type: "PLAYING"}).then(presence => console.log("Now playing " + presence.activities[0].name+ "."));
			},
			perm: "MANAGE_NICKNAMES"	
		},
		watch: {
			exec: function(msg, args) {
				bot.client.user.setActivity(args.join(" "), {type: "WATCHING"}).then(presence => console.log("Now watching " + presence.activities[0].name+ "."));
			},
			perm: "MANAGE_NICKNAMES"
		},
		listen: {
			exec: function(msg, args) {
				bot.client.user.setActivity(args.join(" "), {type: "LISTENING"}).then(presence => console.log("Now listening to " + presence.activities[0].name+ "."));
			},
			perm: "MANAGE_NICKNAMES"
		}
	},
	events: {},
	init: function(m_bot) {
		bot = m_bot;
		console.log("[Statusizer] Initializing");
	}
};

