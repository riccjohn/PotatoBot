const Discord = require('discord.js');
const client = new Discord.Client();
const { roll } = require('./commands/roll');

client.on('ready', () => {
  client.user.setActivity('with JavaScript');
  console.log('Connected as ' + client.user.tag);
  const botChannel = client.channels.get('537707944083456029');
  botChannel.send('PotatoBot, reporting for duty!');
});

const processCommand = message => {
  const fullCommand = message.content.substr(1);
  const splitCommand = fullCommand.split(' ');
  const primaryCommand = splitCommand[0].toLowerCase();
  const args = splitCommand.slice(1);

  console.log('Command Received ==> ', primaryCommand);
  console.log('Arguments ==> ', args);

  if (primaryCommand === 'r') roll(args, message);
  else message.channel.send('I dont understand that command.');
};

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
