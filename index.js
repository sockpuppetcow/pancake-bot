var fs = require('fs');
var token = fs.readFileSync('token.txt', 'utf8');
token = token.replace(/\r|\n/g, "")
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", function() {
	console.log("Hi, I'm Pancake!");
});

client.login(token);
