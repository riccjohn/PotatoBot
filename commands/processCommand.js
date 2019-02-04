const { roll } = require('./roll');

const processCommand = message => {
  const fullCommand = message.content.substr(1);
  const primaryCommand = fullCommand
    .slice(0, fullCommand.indexOf(' '))
    .toLowerCase();
  const args = fullCommand.slice(fullCommand.indexOf(' ')).trim();

  if (primaryCommand === 'r' || primaryCommand === 'roll') roll(args, message);
  else message.channel.send('I dont understand that command.');
};

module.exports = {
  processCommand,
};
