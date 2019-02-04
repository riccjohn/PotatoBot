const singleRoll = (dieSize) => {
  return Number(Math.floor(Math.random() * dieSize) + 1);
};

const parseRollArgs = (args, receivedMessage) => {
  const comment = args.includes('#') ? args.split('#')[1] : null;
  const argsNoComment = args.includes('#') ? args.slice(0, args.indexOf('#')) : args;
  let argsArray;

  if (argsNoComment.includes(' + ')) argsArray = argsNoComment.split(' + ');
  else if (argsNoComment.includes(' +')) argsArray = argsNoComment.split(' +');
  else if (argsNoComment.includes('+ ')) argsArray = argsNoComment.split('+ ');
  else if (argsNoComment.includes('+')) argsArray = argsNoComment.split('+');
  else argsArray = [argsNoComment];

  argsArray = argsArray.map(arg => {
    if (arg.includes('d')) {
      return arg.split('d');
    } else return arg;
  });

  const author = receivedMessage.author.toString() || 'test';

  return {
    comment,
    argsArray,
    author,
  };
};

const roll = (args, receivedMessage) => {
  const parsedArgs = parseRollArgs(args, receivedMessage);
  const { comment, argsArray, author } = parsedArgs;
  console.log('Comment:', comment);
  console.log('Args:', argsArray);
  console.log('Author:', author);
};

module.exports = {
  roll
};
