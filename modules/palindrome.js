//Pancake Bot Palindrome Module
var bot;

module.exports = {
	config: {
		name: "Palindrome"
	},
	commands: {},
	events: {
		message: function (msg) {
			//Whole sentences
			var trim = msg.content.replace(/[^0-9a-z]/gi, '').toUpperCase();
			var revtrim = trim.split("").reverse().join("");

			if (trim === revtrim && trim.length > 3) {
				msg.react('🔁');
			}

			//Single word palindromes
			if (msg.author != bot.client.user) {
				var words = msg.content.split(" ");
				for (key in words) {
					var word = words[key].toUpperCase();
					var revword = word.split("").reverse().join("");
					if (word === revword && word.length > 3) {
						msg.react('🔂');
						return;
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

