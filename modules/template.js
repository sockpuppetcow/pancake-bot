//Pancake Bot Module Template
var bot;

module.exports = {
	config: {
		name: "Template"
	},
	commands: {},
	events: {},
	init: function(m_bot) {
		bot = m_bot;
		console.log("[Template] Initializing");
	}
};

