const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('Connected as ' + client.user.tag);
});

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
const bot_secret_token =
  'NTM3NzA4MjkxNzQ1MTIwMjU3.DypMCA.lMzjkvCzMHAteDrCzjN4xo5Q_pg';

client.login(bot_secret_token);
