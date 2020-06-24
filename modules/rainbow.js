//Pancake Bot Database Test Module
var bot;

module.exports = {
	config: {
		name: "Rainbow"
	},
	commands: {
		rainbow: {
			exec: function(msg, args) {
				//msg = Full msg object, as from the message event.
				//args = Arguments, String[]. args[0] is the first argument after the command itself
				var text = ":heart::orange_heart::yellow_heart::green_heart::blue_heart::purple_heart:";
				msg.channel.send(text);
			}
		}
	},
	events: {},
	init: function(m_bot) {
		bot = m_bot;
		console.log("[Rainbow] Initializing");
	}
}

