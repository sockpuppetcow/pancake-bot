//Pancake Bot Palindrome Module
var bot;

module.exports = {
	config: {
		name: "Palindrome"
	},
	commands: {},
	events: {
		message: function (msg) {
			if (msg.author != bot.client.user) {
				var words = msg.content.split(" ");
				for (key in words) {
					var word = words[key].toUpperCase();
					if (word.length > 3) {
						var reversed = word.split("").reverse().join("");
						if (reversed === word) {
							msg.react('🔁');
							return;
						}
					}
				}
			}
		}
	},
	init: function(m_bot) {
		bot = m_bot;
		console.log("[Palindrome] Initializing");
	}
};

