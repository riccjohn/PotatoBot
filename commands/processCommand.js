const { roll, createRollResponse } = require('./roll');

const processCommand = message => {
  const fullCommand = message.content.substr(1);
  const primaryCommand = fullCommand
    .slice(0, fullCommand.indexOf(' '))
    .toLowerCase();
  const args = fullCommand.slice(fullCommand.indexOf(' ')).trim();

  switch(primaryCommand) {
    case 'r':
      return createRollResponse(roll(args, message.author.toString()));
    case 'roll':
      return createRollResponse(roll(args, message.author.toString()));
    default:
      message.channel.send('I dont understand that command.');
  }
};

module.exports = {
  processCommand,
};
