const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  client.user.setActivity('with JavaScript');
  console.log('Connected as ' + client.user.tag);
  console.log('Servers:');
  client.guilds.forEach(guild => {
    console.log(' - ' + guild.name);
    guild.channels.forEach(channel => {
      console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
    });
  });
  const botChannel = client.channels.get('537707944083456029');
  botChannel.send('PotatoBot, reporting for duty!');
});

const roll = (args, message) => {
  const dieRoll = args[0].split('+');
  const die = dieRoll[0].split('d')[1];
  let modifier = dieRoll[1];

  if (modifier === undefined) modifier = 0;

  const baseRoll = Number(Math.floor(Math.random() * die) + 1);
  const rollWithModifiers = baseRoll + Number(modifier);

  message.channel.send(baseRoll + ' + ' + modifier + ' = ' + rollWithModifiers);
};

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
