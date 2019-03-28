const roll = function(input, author) {
  const parsedArgs = parseRollArgs(input);
  const rawRolls = getRolls(parsedArgs.numOfDie, parsedArgs.dieSize);
  const sortedRolls = rawRolls.slice().sort((a, b) => {
    return a - b;
  });
  let finalRolls = parsedArgs.flags.length ? [] : rawRolls;
  let discardedRolls = [];

  for (let i = 0; i < parsedArgs.flags.length; i++) {
    let flag = parsedArgs.flags[i];

    switch(flag) {
      case 'adv' || 'advantage' || 'a':
        // TODO: have this send an error to the channel, not the terminal
        if (sortedRolls.length > 2) return 'Error: Cannot use advantage with more than two rolls';
        finalRolls.push(sortedRolls[sortedRolls.length - 1]);
        discardedRolls.push(...sortedRolls.slice(0, sortedRolls.length - 1));
        break;
      case 'dis' || 'disadvantage' || 'd':
        // TODO: have this send an error to the channel, not the terminal
        if (sortedRolls.length > 2) return 'Error: Cannot use advantage with more than two rolls';
        finalRolls.push(sortedRolls[0]);
        discardedRolls.push(...sortedRolls.slice(1, sortedRolls.length));
        break;
      default:
        break;
    }
  }

  let total = finalRolls.reduce((acc, curr) => {
    acc += curr;
    return acc;
  }, 0);

  parsedArgs.modifier ? total += parsedArgs.modifier : null;

  const output = {
    input: input.includes('#') ? input.slice(0, input.indexOf('#') - 1) : input,
    rolls: finalRolls,
    discarded: discardedRolls,
    mod: parsedArgs.modifier,
    sum: total,
    author: author,
    comment: parsedArgs.comment,
  };

  return output;
};

const getRolls = function( numOfDie, dieSize ) {
  const rollArray = [];
  for (let i = 0; i < numOfDie; i++) {
    rollArray.push(singleRoll(dieSize));
  }
  return rollArray;
};

const parseRollArgs = function(command) {
  let splitCommand;

  if (command.includes('#')) {
    splitCommand = command.split('#');
  } else splitCommand = [command];

  let [tokens, comment] = splitCommand;

  const args = {
    comment,
    flags: [],
  };

  tokens = tokens.trim().split(' ');

  let modifier = null;

  const tokenReducer = (acc, curr, idx) => {
    if (curr.match(/\d+d\d+/)) {
      acc.rollString = curr;
    } else if (curr === '+') {
      modifier = curr;
    } else if (curr.match(/^\d+$/)) {
      acc.modifier = Number(curr);
    } else if (curr.startsWith('-')) {
      acc.flags.push(curr.substr(1));
    }
    return acc;
  };

  const tokensObject = tokens.reduce(tokenReducer, args);

  if (tokensObject.rollString) {
    const [ _, numOfDie, dieSize ] = tokensObject.rollString.match(/(\d+)d(\d+)/);
    tokensObject.numOfDie = numOfDie;
    tokensObject.dieSize = dieSize;
  }

  return tokensObject;
};

const singleRoll = function(dieSize) {
  return Number(Math.floor(Math.random() * dieSize) + 1);
};

const createRollResponse = function(data) {
  const { input, rolls, discarded, mod, sum, author, comment } = data;
  let response = author + ': ' + '`' + input + '`';
  if (comment) response += ' _' + comment + '_ => (';
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
  createRollResponse
};
