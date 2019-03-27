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

  const input = args.slice(0, firstFlag).trim();

  let argsArray;

  const modifierSplits = [' + ', ' +', '+ ', '+'];

  modifierSplits.forEach(el => {
    if (input.includes(el)) argsArray = input.split(el);
    else argsArray = [input];
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

  const parsedArgs = {
    argsArray,
    input,
    flags,
    comment,
    author,
  };

  console.log('Parsed Arguments ==>', parsedArgs);

  return parsedArgs;
};

const roll = function(args, receivedMessage) {
  const parsedArgs = parseRollArgs(args, receivedMessage);
  const { argsArray, input, flags, comment, author } = parsedArgs;

  let rolls = [];
  let mod = 0;

  for (let i = 0; i < argsArray.length; i++) {
    let numOfDice, dieSize;

    if (Array.isArray(argsArray[i]) && argsArray[i].length === 2) {
      numOfDice = argsArray[i][0];
      dieSize = argsArray[i][1];
      for (let j = 0; j < numOfDice; j++) {
        rolls.push(singleRoll(dieSize));
      }
    } else mod = Number(argsArray[i]);
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

  const sum =
    rolls.reduce((acc, curr) => {
      return acc + curr;
    }, 0) + mod;

  if (isNaN(sum)) {
    try {
      receivedMessage.channel.send('Error: sum was not a number');
      logger.error('sum was NaN. Input was %s', args);
    } catch (error) {
      logger.error(error);
    }
  } else {
    try {
      const rollData = {
        input,
        rolls,
        mod,
        sum,
        author,
        comment,
      };

      receivedMessage.channel.send(
        createRollResponse(rollData)
      );
    } catch (error) {
      logger.error(error);
    }
  }
};

const createRollResponse = function(data) {
  const { input, rolls, mod, sum, author, comment } = data;
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
