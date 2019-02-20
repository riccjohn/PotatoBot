const { logger } = require('../utils/logger');

const singleRoll = function(dieSize) {
  return Number(Math.floor(Math.random() * dieSize) + 1);
};

const parseRollArgs = function(args, receivedMessage) {
  const hasComment = args.includes('#');
  const hasFlag = args.includes('-');
  const comment = hasComment ? args.slice(args.indexOf('#')) : null;

  const flags = hasFlag
    ? hasComment
      ? args.slice(args.indexOf('-') + 1, args.indexOf('#')).trim()
      : args.slice(args.indexOf('-') + 1).trim()
    : null;

  let firstFlag;

  if (hasFlag && hasComment) {
    firstFlag =
      args.indexOf('#') < args.indexOf('-')
        ? args.indexOf('#')
        : args.indexOf('-');
  } else if (hasFlag) {
    firstFlag = args.indexOf('-');
  } else if (hasComment) {
    firstFlag = args.indexOf('#');
  } else {
    firstFlag = args.length;
  }

  const argsNoComment = args.slice(0, firstFlag).trim();

  let argsArray;

  const modifierSplits = [' + ', ' +', '+ ', '+'];

  modifierSplits.forEach(el => {
    if (argsNoComment.includes(el)) argsArray = argsNoComment.split(el);
    else argsArray = [argsNoComment];
  });

  argsArray = argsArray.map(arg => {
    if (arg.includes('d')) {
      let arr = arg.split('d');
      return arr.map(el => {
        return Number(el);
      });
    } else return arg;
  });

  logger.info(
    'Input Args => %s Flags => %s Comment=> %s',
    args,
    flags,
    comment
  );

  const author = receivedMessage.author.toString() || '';

  return {
    argsArray,
    argsNoComment,
    flags,
    comment,
    author,
  };
};

const roll = function(args, receivedMessage) {
  const parsedArgs = parseRollArgs(args, receivedMessage);
  const { argsArray, argsNoComment, flags, comment, author } = parsedArgs;
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

  switch (flags) {
    case 'adv' || 'advantage' || 'a':
      rolls = [Math.max(...rolls)];
      console.log('Rolling with advantage');
      break;
    case 'dis' || 'disadvantage' || 'd':
      rolls = [Math.min(...rolls)];
      console.log('Rolling with disadvantage');
      break;
    default:
      break;
  }

  const total =
    rolls.reduce((acc, curr) => {
      return acc + curr;
    }, 0) + modifier;

  if (isNaN(total)) {
    try {
      receivedMessage.channel.send('Error: total was not a number');
      logger.error('Total was NaN. Input was %s', args);
    } catch (error) {
      logger.error(error);
    }
  } else {
    try {
      receivedMessage.channel.send(
        createRollResponse(origCommand, rolls, modifier, total, author, comment)
      );
    } catch (error) {
      logger.error(error);
    }
  }
};

const createRollResponse = function(input, rolls, mod, sum, author, comment) {
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
