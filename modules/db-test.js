//Pancake Bot Database Test Module
var bot;

module.exports = {
	config: {
		name: "Database Test"
	},
	commands: {
		lorem: function(msg, args) {
			//msg = Full msg object, as from the message event.
			//args = Arguments, String[]. args[0] is the first argument after the command itself
			
			bot.database.exec("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");
			var stmt = bot.database.prepare("INSERT INTO lorem VALUES (?)");
			for (var i = 0; i < 10; i++) {
			    stmt.run("Ipsum " + i);
			}
		},
		ipsum: function(msg, args) {
			var stmt = bot.database.prepare("SELECT rowid AS id, info FROM lorem");
			const ipsum = stmt.all();
			var ipsum_str = "";
			ipsum.forEach(element => {
				console.log(element);
				ipsum_str = ipsum_str + element.id + " : " + element.info + "\n";
			})
			console.log(ipsum);
			msg.channel.send(ipsum_str);
		}
	},
	events: {},
	init: function(m_bot) {
		bot = m_bot;
		console.log("[Database Test] Initializing");
	}
};

