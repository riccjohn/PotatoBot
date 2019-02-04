const singleRoll = function(dieSize) {
  return Number(Math.floor(Math.random() * dieSize) + 1);
};

const parseRollArgs = function(args, receivedMessage) {
  const comment = args.includes('#') ? args.split('#')[1] : null;
  const argsNoComment = args.includes('#')
    ? args.slice(0, args.indexOf('#'))
    : args;

  let argsArray;

  if (argsNoComment.includes(' + ')) argsArray = argsNoComment.split(' + ');
  else if (argsNoComment.includes(' +')) argsArray = argsNoComment.split(' +');
  else if (argsNoComment.includes('+ ')) argsArray = argsNoComment.split('+ ');
  else if (argsNoComment.includes('+')) argsArray = argsNoComment.split('+');
  else argsArray = [argsNoComment];

  argsArray = argsArray.map(arg => {
    if (arg.includes('d')) {
      let arr = arg.split('d');
      return arr.map(el => {
        return Number(el);
      });
    } else return arg;
  });

  const author = receivedMessage.author.toString() || '';

  return {
    comment,
    argsArray,
    author,
    argsNoComment,
  };
};

const roll = function(args, receivedMessage) {
  const parsedArgs = parseRollArgs(args, receivedMessage);
  const { comment, argsArray, author, argsNoComment } = parsedArgs;
  const origCommand = argsNoComment;

  let rolls = [];
  let modifier = 0;

  for (let i = 0; i < argsArray.length; i++) {
    let numOfDice, dieSize;

    if (Array.isArray(argsArray[i]) && argsArray[i].length === 2) {
      numOfDice = argsArray[i][0];
      dieSize = argsArray[i][1];
      for (let j = 0; j < numOfDice; j++) {
        rolls.push(singleRoll(dieSize));
      }
    } else modifier = Number(argsArray[i]);
  }

  const total =
    rolls.reduce((acc, curr) => {
      return acc + curr;
    }, 0) + modifier;

  receivedMessage.channel.send(
    createResponse(origCommand, rolls, modifier, total, author, comment)
  );
};

const createResponse = function(input, rolls, mod, sum, author, comment) {
  let response = author + ': ' + '`' + input + '`';
  if (comment) response += ' ' + comment + ' => (';
  else response += ' => (';

  for (let i = 0; i < rolls.length; i++) {
    response += rolls[i];
    if (i < rolls.length - 1) response += '+';
  }
  response += ')';
  if (mod) response += ` + ${mod} = **${sum}**`;
  else response += ` = **${sum}**`;

  return response;
};

module.exports = {
  roll,
};
