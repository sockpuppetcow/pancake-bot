//Pancake Bot Module Template
let bot;
let flags = {};
let urls = {};

function urlMin() {
	var min;	
	let keys = Object.keys(urls);
	var url = keys[0];
	min = urls[keys[0]];
	let k = 0;
	for (k = 0; k < keys.length; k++) {
		let c = urls[keys[k]];
		if (c < min && keys[k] != undefined) {
			min = c;
			url = keys[k];
		} else if (c == min && keys[k] != undefined) {
			//If the two match, pick one at random
			if (Math.random() > 0.49) {
				min = c;
				url = keys[k];
			}
		}
	}

	console.log("url = " + url);
	
	if (url == undefined) {
		console.log("min = " + min);
		console.log("k = " + k);
	}

	return url;
}

function change_avatar() {
	let u = urlMin();
	let c = urls[u];
	let d = new Date();

	bot.client.user.setAvatar(u).then(user => console.log("New avatar set.")).catch(console.error);

	const upd_flags = bot.database.prepare("UPDATE changeling_flags SET last_updated = (?)");
	upd_flags.run(d.getDate());
	flags.last_updated = d.getDate();

	const upd_avatars = bot.database.prepare("UPDATE changeling_avatars SET used_count = (?) WHERE avatar_url = (?)");
	upd_avatars.run(c+1, u);
	urls[u] = c+1;
}

function check_update() {
	//It is now an even hour
	
	let d = new Date();
	console.log("Date: " + d.getDate() + " Day: " + d.getDay());
	if (flags.last_updated != d.getDate() && flags.update_on == d.getDay()) {
		change_avatar();
	}
	console.log(Date.now());
	console.log("It is an even hour again.");
}

function isURL(str) {
     let urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
     let url = new RegExp(urlRegex, 'i');
     return str.length < 2083 && url.test(str);
}

function refreshURLs() {
	let stmt = bot.database.prepare('SELECT * FROM changeling_avatars');
	let refreshed = {};
	for (const row of stmt.iterate()) {
		refreshed[row.avatar_url] = row.used_count;
	}
	return refreshed;
}

function refreshFlags() {
	let stmt = bot.database.prepare('SELECT * FROM changeling_flags');
	let row = stmt.get();
	let refreshed = {};
	if (row == undefined) {
		console.log("Changeling flags not set. Setting defaults.");
		const set = bot.database.prepare("INSERT INTO changeling_flags (last_updated, update_on) VALUES (?, ?)");
		set.run(0,0);
		row = stmt.get();
	}
	refreshed["last_updated"] = row['last_updated'];
	refreshed["update_on"] = row['update_on'];
	return refreshed;
}

module.exports = {
	config: {
		name: "Changeling"
	},
	commands: {
		changeling: {
			exec: function(msg, args) {
				let subcmd = args[0];
				if (subcmd.toLowerCase() == "add") {
					let url = args[1];
					if (isURL(url)) {
						const ins = bot.database.prepare('INSERT INTO changeling_avatars (avatar_url) VALUES (?);');
						ins.run(url);

						urls = refreshURLs();

						msg.channel.send("```\nAdded " + url + " successfully.\n```");
					} else {
						msg.reply("Not a valid URL");
					}
				} else if (subcmd.toLowerCase() == "list") {
					urls = refreshURLs();
					let toSend = "```\n";
					
					for (var key in urls) {
						toSend = toSend + key + "\t" + urls[key] + "\n";
					}
					toSend = toSend + "```";

					msg.channel.send(toSend);
				} else if (subcmd.toLowerCase() == "remove") {
					let url = args[1];
					if (isURL(url)) {
						if (urls[url] == undefined) {
							msg.reply("I don't have that URL");
						} else {
							const del = bot.database.prepare("DELETE FROM changeling_avatars WHERE avatar_url = (?)");
							del.run(url);
							urls = refreshURLs();
							msg.channel.send("```\nRemoved " + url + " successfully.\n```");
						}
					}
				} else if (subcmd.toLowerCase() == "purge") {
					bot.database.exec("DELETE FROM changeling_avatars;");
					msg.channel.send("Removed all changeling entries. The current avatar will now remain until more are added.");
					urls = refreshURLs();
				} else if (subcmd.toLowerCase() == "resetflags") {
					const rst = bot.database.prepare("UPDATE changeling_flags SET last_updated = (?), update_on = (?)");
					rst.run(0,0);
					flags.last_updated = 0;
					flags.update_on = 0;
				} else if (subcmd.toLowerCase() == "day") {
					let d = args[1];
					if (d > 6 || d < 0) {
						msg.reply("Day must be [0,6]");
					} else {
						const upd = bot.database.prepare("UPDATE changeling_flags SET update_on = (?)");
						upd.run(d);

						flags.update_on = d;
						msg.channel.send("Avatar will now update on day " + d + " of each week.");
					}
				} else if (subcmd.toLowerCase() == "force") {
					let url = args[1];
					if (isURL(url)) {
						if (urls[url] == undefined) {
							msg.channel.send("I don't have that URL, attempting to change anyway, but usage data will not be tracked.");
						}
						bot.client.user.setAvatar(url).then(user => console.log("New avatar set.")).catch(console.error);
					}
				} else if (subcmd.toLowerCase() == "repick") {
					msg.channel.send("Selecting new avatar.");
					change_avatar();
				}
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
		
		bot.database.exec("CREATE TABLE IF NOT EXISTS changeling_flags (last_updated INTEGER DEFAULT 0, update_on INTEGER DEFAULT 0)");
		bot.database.exec("CREATE TABLE IF NOT EXISTS changeling_avatars (avatar_url TEXT, used_count INTEGER DEFAULT 0)");	

		urls = refreshURLs();
		flags = refreshFlags();

		console.log("Last updated: " + flags.last_updated);
		console.log("Update on: " + flags.update_on);

		if (urls.length == 0) {
			console.log("There are no avatars for changeling! Canceling schedule.");
			return;
		}

		let hour_in_ms = 3600000
		let now = Date.now();
		let mstoh = hour_in_ms - (now % hour_in_ms);
		console.log("" + mstoh + " milliseconds to the next hour.");
		if (mstoh > 0) {
			setTimeout(function() {
				console.log(Date.now());
				console.log("It is now an even hour.");
				check_update();
				setInterval(check_update, hour_in_ms);
			}, mstoh);
		}
	}
};

