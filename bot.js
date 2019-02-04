const Discord = require('discord.js');
const client = new Discord.Client();
const { processCommand } = require('./commands/processCommand');
const { token } = require('./config');

client.on('ready', () => {
  try {
    client.user.setActivity('with JavaScript');
    console.log('Connected as ' + client.user.tag + '\n');
    const botChannel = client.channels.get('537707944083456029');
    botChannel.send('PotatoBot, reporting for duty!');
  } catch (error) {
    console.error(error);
  }
});

client.on('message', receivedMessage => {
  // Prevent bot from responding to its own messages
  try {
    if (
      receivedMessage.author !== client.user &&
      receivedMessage.content.startsWith('!')
    ) {
      processCommand(receivedMessage);
    } else {
      return;
    }
  } catch (error) {
    console.error(error);
  }
});

client.on('error', console.error);

client.login(token);
