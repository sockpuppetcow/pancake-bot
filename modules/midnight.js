//Pancake Bot Module Template
var bot;

module.exports = {
	config: {
		name: "Midnight"
	},
	commands: {
		say: {
			exec: function(msg, args) {
				if (args.length < 2) {
					return;
				}
				//Grab channel ID and remove it from args.
				let channel = args.shift().slice(2,-1);
				let repeat = args.join(" ");
				
				msg.guild.channels.resolve(channel).send(repeat);
			},
			perm: "ADMINISTRATOR"	
		}
	},
	events: {},
	init: function(m_bot) {
		bot = m_bot;
		console.log("[Midnight] Initializing");
	}
};

