//Pancake Bot Palindrome Module
var bot;

module.exports = {
	config: {
		name: "Palindrome"
	},
	commands: {},
	events: {
		message: function (msg) {
			//Trim out all the special characters
			var trim = msg.content.replace(/[^0-9a-z\s]/gi, '').toUpperCase();
			
			//Whole sentences
			var spaceless = trim.replace(/[^0-9a-z]/gi, '').toUpperCase();
			var revs = spaceless.split("").reverse().join("");
			
			if (spaceless === revs && spaceless.length > 3) {
				msg.react('🔁');
			}

			//Single word palindromes
			if (msg.author != bot.client.user) {
				var words = trim.split(" ");
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

