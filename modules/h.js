//Pancake Bot Database Test Module
var bot;

module.exports = {
	config: {
		name: "Database Test"
	},
	commands: {
		h: {
			exec: function(msg, args) {
				//msg = Full msg object, as from the message event.
				//args = Arguments, String[]. args[0] is the first argument after the command itself
				var h = Math.floor(Math.random() * 2000) + 1;
				var text = "";
				var i;
				for (i = 0; i < h; i++) {
					var upper = Math.round(Math.random());
					if (upper) {
						text += "H";
					} else {
						text += "h";
					}
				}
				msg.channel.send(text);
			},
			perm: "SEND_MESSAGES"
		},
		h2: {
			exec: function(msg, args) {
				//msg = Full msg object, as from the message event.
				//args = Arguments, String[]. args[0] is the first argument after the command itself
				var h = Math.floor(Math.random() * 2000) + 1;
				var text = "";
				var i;
				for (i = 0; i < h; i++) {
					var upper = Math.round(Math.random());
					if (upper) {
						text += "H";
					} else {
						text += "h";
					}
				}
				msg.channel.send(text);
			},
			perm: "ADMINISTRATOR"
		},
		h3: {
			exec: function(msg, args) {
				//msg = Full msg object, as from the message event.
				//args = Arguments, String[]. args[0] is the first argument after the command itself
				var h = Math.floor(Math.random() * 2000) + 1;
				var text = "";
				var i;
				for (i = 0; i < h; i++) {
					var upper = Math.round(Math.random());
					if (upper) {
						text += "H";
					} else {
						text += "h";
					}
				}
				msg.channel.send(text);
			}
		}
	},
	events: {},
	init: function(m_bot) {
		bot = m_bot;
		console.log("[H] Initializing");
	}
};

