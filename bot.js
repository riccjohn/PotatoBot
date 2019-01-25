const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  client.user.setActivity('with JavaScript');
  console.log('Connected as ' + client.user.tag);
  const botChannel = client.channels.get('537707944083456029');
  botChannel.send('PotatoBot, reporting for duty!');
});

const singleRoll = (dieSize) => {
  return Number(Math.floor(Math.random() * dieSize) + 1);
};

const roll = (args, receivedMessage) => {
  const dieRoll = args[0].split('+');
  const die = dieRoll[0].split('d')[1];
  const numOfDie = dieRoll[0].split('d')[0];
  const modifier = Number(dieRoll[1]);
  const baseRolls = [];
  const author = receivedMessage.author.toString();

  for (let i = 0; i < numOfDie; i++) {
    baseRolls.push(singleRoll(die));
  }

  let baseResponse = author + ': ' + '`' + args[0] + '`' + ' => (';

  const rollSum = baseRolls.reduce((acc, curr) => {
    return acc += curr;
  }, 0);

  const createResponse = () => {
    let response = baseResponse;

    for (let i = 0; i < baseRolls.length; i++) {
      response += baseRolls[i];
      if (i < baseRolls.length - 1) response += '+';
    }
    response += ')';

    if (modifier) response += ` + ${modifier} = **${rollSum + modifier}**`;
    else response += ` = **${rollSum }**`;

    return response;
  };

  receivedMessage.channel.send(createResponse());
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
