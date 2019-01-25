const roll = (args, receivedMessage) => {
  const dieRoll = args[0].split('+');
  const die = dieRoll[0].split('d')[1];
  const numOfDie = dieRoll[0].split('d')[0];
  const modifier = Number(dieRoll[1]);
  const baseRolls = [];
  const author = receivedMessage.author.toString();

  const singleRoll = (dieSize) => {
    return Number(Math.floor(Math.random() * dieSize) + 1);
  };

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

module.exports = {
  roll
}
