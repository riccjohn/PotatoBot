const Discord = require('discord.js');
const client = new Discord.Client();
const { processCommand } = require('./commands/processCommand');

client.on('ready', () => {
  client.user.setActivity('with JavaScript');
  console.log('Connected as ' + client.user.tag);
  const botChannel = client.channels.get('537707944083456029');
  botChannel.send('PotatoBot, reporting for duty!');
});

client.on('message', receivedMessage => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author === client.user) {
    return;
  }

  if (receivedMessage.content.startsWith('!')) {
    processCommand(receivedMessage);
  }
});

const botSecretToken =
  'NTM3NzA4MjkxNzQ1MTIwMjU3.DypMCA.lMzjkvCzMHAteDrCzjN4xo5Q_pg';

client.login(botSecretToken);
