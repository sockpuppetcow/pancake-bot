//Pancake Bot Fight Club
var bot;

function generateLine(user, target, damage) {
	let lines = [
		user + " slaps " + target + " around a bit with a large trout, dealing " + damage + " damage.",
		user + " casts magic missile, and hits " + target + " with " + damage + " damage.",
		user + " punts " + target + " to the moon.",
		user + " strangles " + target + " dealing " + damage + " damage.",
		user + " hits " + target + "'s ankles with a wrench, dealing " + damage + " damage.",
		user + " kicks " + target + " dealing " + damage + " damage.",
		user + " roundhouse kicks " + target + " dealing " + damage + " damage.",
		user + " casts fireball at " + target + " and deals " + damage + " damage.",
		user + " snaps " + target + " out of existence.",
		user + " tases " + target + " dealing " + damage + " damage.",
		user + " smashes a TV over " + target + "'s head, dealing " + damage + " damage.",
		user + " throws " + target + " against a wall, dealing " + damage + " damage.",
		user + " drops " + target + " horizontally, dealing " + damage + " damage.",
		user + " tastes " + target + " dealing " + damage + " damage.",
		user + " slide tackles " + target + " dealing " + damage + " damage.",
		user + " body slams " + target + " dealing " + damage + " damage.",
		user + " curb stomps " + target + " dealing " + damage + " damage."
	];

	return lines[Math.floor(Math.random()*lines.length)];
}

module.exports = {
	config: {
		name: "Fight Club"
	},
	commands: {
		fight: {
			exec: function(msg, args) {
				let u = msg.member.displayName;
				let t = args.join(" ");
				let d = Math.floor(Math.random()*100)+1;
				
				let line = generateLine(u,t,d);

				msg.channel.send(line);
			},
			perm: "SEND_MESSAGES"
		}
	},
	events: {},
	init: function(m_bot) {
		bot = m_bot;
		console.log("[Fight Club] Initializing");
	}
};

