//Pancake Bot Reaction Roles Module

var bot;
var associations = {};

function onCollect(reaction, user) {
	var assoc_map = associations[reaction.message.id];
	console.log("Collected " + reaction.emoji.toString() + ". Give user " + user.id + " the role " + assoc_map.get(reaction.emoji.toString()));
	reaction.message.guild.members.resolve(user.id).roles.add(assoc_map.get(reaction.emoji.toString()));
}

function onRemove(reaction, user) {
	var assoc_map = associations[reaction.message.id];
	console.log("Removed " + reaction.emoji.toString() + ". Revoke from user " + user.id + " the role " + assoc_map.get(reaction.emoji.toString()));
	reaction.message.guild.members.resolve(user.id).roles.remove(assoc_map.get(reaction.emoji.toString()));
}

module.exports = {
	config: {
		name: "Reaction Roles"
	},
	commands: {
		reactionrole: {
			exec: function(msg, args) {
				if (args.length < 3) {
					msg.channel.send("Must have at least 3 arguments.");
					return;
				}

				var channel = null;
				var channel_res = args[0];
				if (channel_res.startsWith("<#") && channel_res.endsWith(">")) {
					channel = msg.guild.channels.resolve(channel_res.slice(2,-1));
				}

				if (channel == null || channel == undefined) {
					msg.channel.send("Could not resolve channel.");
					return;
				}

				var title = "";
				var i = 1;
				if (args[1].startsWith("\"")) {

					for (i = 1; i < args.length; i++) {
						title = title + args[i] + " ";
						if (args[i].endsWith("\"")) {
							i++;
							break;
						}
					}
					if (i == args.length) {
						msg.channel.send("It appears your title does not have a closing quotation mark.");
						return;
					}
				}
				//Trim the quotation marks off the title
				title = title.slice(1,-2);
				console.log("Title: " + title);


				//Grab emoji and role resolvables (alternating) and then send the message and initial reactions.

				var assoc_map = new Map();

				//As a result of lines 21-27, i should now be set to the first emoji index in the arguments
				
				//Make sure arguents match up now.
				
				if ((args.length - i) %2 != 0) {
					msg.channel.send("Argument length mismatch.");
					return;
				}

				//Get and verify the emoji and roles.
				for (; i < args.length; i+=2) {
					//args[i]: emoji
					//args[i+1]: role

					var e = args[i];
					var r = args[i+1];

					if (r.startsWith("<@&") && r.endsWith(">")) {
						r = r.slice(3,-1);
					} else {
						msg.channel.send(r + " is not a valid role mention.");
						return;
					}

					assoc_map.set(e,r);
				}

				//Setup the message.
				const embed = new bot.discord.MessageEmbed();
				embed.setTitle(title);
				assoc_map.forEach(function(r, e) {
					console.log(e, r);
					embed.addField(e, "<@&" + r + ">", true);
				});

				channel.send(embed).then(function(m) {
					associations[m.id] = assoc_map;
					console.log(m.id);
					var inserts = []
					i = 0;
					assoc_map.forEach(function(r, e) {
						var e_split = e.split(":");
						var e_ident = e_split[e_split.length-1];
						if (e_ident.endsWith(">")) {
							e_ident = e_ident.slice(0,-1);
						}
						inserts[i] = {g_id: m.guild.id, c_id: m.channel.id, m_id: m.id, e_id: e, r_id: r};
						i++;
						m.react(e_ident);
					});

					//Add associations to db
					const ins = bot.database.prepare('INSERT INTO reactionroles_assoc (guild_id, channel_id, message_id, emoji_id, role_id) VALUES (@g_id, @c_id, @m_id, @e_id, @r_id);');

					const insertMany = bot.database.transaction((rows) => {
  						for (const row of rows) {
  							ins.run(row);
  						}
					});

					insertMany(inserts);

					const filter = (reaction, user) => user.id != bot.client.user.id;
					var collector = m.createReactionCollector(filter, {dispose: true});
					collector.on('collect', onCollect);
					collector.on('remove', onRemove);

				});
			},
			perm: "MANAGE_ROLES"
		}
	},
	events: {
		messageDelete: function(deleted) {
			if (deleted.author.id == bot.client.user.id) {
				//TODO: Check if there's an association with that message ID first.
				const del = bot.database.prepare("DELETE FROM reactionroles_assoc WHERE message_id = (?)");
				del.run(deleted.id);
			}
		}
	},
	init: function(m_bot) {
		bot = m_bot;
		bot.database.exec("CREATE TABLE IF NOT EXISTS reactionroles_assoc (guild_id TEXT, channel_id TEXT, message_id TEXT, emoji_id TEXT, role_id TEXT)");

		var stmt = bot.database.prepare('SELECT * FROM reactionroles_assoc')
		var listening = {};	//The ones we're already listening so we don't make duplicate listeners.
		var k = 0;
		for (const row of stmt.iterate()) {
			if (associations[row.message_id] == null || associations[row.message_id] == undefined) {
				associations[row.message_id] = new Map();
			}
			associations[row.message_id].set(row.emoji_id, row.role_id);

			bot.client.guilds.resolve(row.guild_id).fetch().then(g => {
				g.channels.cache.get(row.channel_id).fetch().then(c => {
					c.messages.fetch(row.message_id).then(m => {
						if (!listening[row.message_id]) {
							const filter = (reaction, user) => user.id != bot.client.user.id;

							var collector = m.createReactionCollector(filter, {dispose: true});
							collector.on('collect', onCollect);
							collector.on('remove', onRemove);

							listening[row.message_id] = true;
						}
					});
				});
			});
		}

		console.log("[Reaction Roles] Yo.");
	}
};
