//Pancake Bot Reaction Roles Module
var bot;

let ballots = {};

function refreshBallots() {
	const get = bot.database.prepare("SELECT * FROM voting_ballots");
	const rows = get.all();
	for (r of rows) {
		ballots[r.guild] = {};
		ballots[r.guild][r.channel] = r.emoji;
	}

	//console.log(ballots);
}

module.exports = {
	config: {
		name: "Voting System"
	},
	commands: {
		votecheck: {
			exec: function(msg, args) {
				let channel = null;
				channel = msg.guild.channels.resolve(args[0].slice(2,-1));
				if (channel == null || channel == undefined) {
					msg.channel.send("Failed to resolve channel.");
					return;
				}

				let e = ballots[msg.guild.id][channel.id];
				
				channel.messages.fetch().then((messages) => {
					messages.sort((a,b) => {
						return a.reactions.resolve(e).count - b.reactions.resolve(e).count;
					});

					let first = messages.first(-args[1]);
					let i = 0;
					let L = 5;
					if (args[L] != undefined && args[L] != null) {
						L = args[1];
					}
					
					let response = "";
					for (i = 0; i < L; i++) {
						response = response + first[i].content + "\n";
					}
					msg.channel.send(response);
					
				}, () => {
					msg.channel.send("Failed to find message.");
				});
				
				return;
			},
			perm: "ADMINISTRATOR"
		},
		votecreate: {
			exec: function(msg, args) {
				let channel = null;
				channel = msg.guild.channels.resolve(args[0].slice(2,-1));
				if (channel == null || channel == undefined) {
					msg.channel.send("Failed to resolve channel.");
					return;
				}

				msg.react(args[1]).then(() => {
					const ins = bot.database.prepare("INSERT INTO voting_ballots VALUES (?, ?, ?);");
					ins.run(msg.guild.id, channel.id, args[1]);
					refreshBallots();
				}, () => {
					msg.channel.send("I can't react with that emoji.");
				});
			},
			perm: "ADMINISTRATOR"
		},
		votedelete: {
			exec: function(msg, args) {
				let channel = null;
				channel = msg.guild.channels.resolve(args[0].slice(2,-1));
				if (channel == null || channel == undefined) {
					msg.channel.send("Failed to resolve channel.");
					return;
				}
				const del = bot.database.prepare("DELETE FROM voting_ballots WHERE channel = (?);");
				del.run(channel.id);
				msg.channel.send("Deleted vote scenario for channel <#" + channel.id + ">");
				refreshBallots();
			},
			perm: "ADMINISTRATOR"
		}
	},
	events: {
		messageDelete: function(deleted) {},
		message: function(msg) {
			if (ballots[msg.guild.id] == null || ballots[msg.guild.id] == undefined) {
				return;
			}
			let e = ballots[msg.guild.id][msg.channel.id];
			if (e == null || e == undefined) {
				return;
			}

			msg.react(e).catch(console.error);
		}
	},
	init: function(m_bot) {
		bot = m_bot;
		bot.database.exec("CREATE TABLE IF NOT EXISTS voting_ballots (guild TEXT, channel TEXT, emoji TEXT);");
		refreshBallots();
	}
};
