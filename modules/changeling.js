//Pancake Bot Module Template
var bot;

function check_update() {
	console.log(Date.now());
	console.log("It is an even hour again.");
}

module.exports = {
	config: {
		name: "Changeling"
	},
	commands: {
		changeling: {
			exec: function(msg, args) {
				let subcmd = args[0];
				//TODO: Add/remove subcmds
			},
			perm: "ADMINISTRATOR"
		}
	},
	events: {},
	init: function(m_bot) {
		bot = m_bot;
		console.log("[Changeling] Initializing.");

		//last_updated INTEGER The last Date (0-31) it was updated
		//update_on INTEGER The Day (0-6) we want to update on
		
		bot.database.exec("CREATE TABLE IF NOT EXISTS changeling_flags (last_updated INTEGER, update_on INTEGER)");

		let hour_in_ms = 3600000
		let now = Date.now();
		let mstoh = hour_in_ms - (now % hour_in_ms);
		console.log("" + mstoh + " milliseconds to the next hour.");
		if (mstoh > 0) {
			setTimeout(function() {
				console.log(Date.now());
				console.log("It is now an even hour.");
				setInterval(check_update, hour_in_ms);
			}, mstoh);
		}

	}
};

