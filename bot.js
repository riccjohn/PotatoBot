const Discord = require('discord.js');
const client = new Discord.Client();
const { logger } = require('./utils/logger');
const { processCommand } = require('./commands/processCommand');
const { token } = require('./config');

client.on('ready', () => {
  try {
    client.user.setActivity('with JavaScript');
    logger.info('Connected as ' + client.user.tag);
    const botChannel = client.channels.get('537707944083456029');
    botChannel.send('PotatoBot, reporting for duty!');
  } catch (error) {
    logger.error('Found %s', error);
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
    logger.error('Found %s', error);
  }
});

client.on('error', error => {
  console.log('CLIENT ERROR ===>');
  logger.error(error);
});

client.login(token);
