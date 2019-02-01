const { roll } = require('./roll');

const processCommand = message => {
  const fullCommand = message.content.substr(1);
  const splitCommand = fullCommand.split(' ');
  const primaryCommand = splitCommand[0].toLowerCase();
  const args = splitCommand.slice(1);

  // console.log('Command Received ==> ', primaryCommand);
  // console.log('Arguments ==> ', args);

  if (primaryCommand === 'r') roll(args, message);
  else message.channel.send('I dont understand that command.');
};

module.exports = {
  processCommand
}
