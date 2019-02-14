const Discord = require('discord.js');
const client = new Discord.Client();
const winston = require('winston');
const { processCommand } = require('./commands/processCommand');
const { token } = require('./config');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

client.on('ready', () => {
  try {
    client.user.setActivity('with JavaScript');
    console.log('Connected as ' + client.user.tag + '\n');
    const botChannel = client.channels.get('537707944083456029');
    botChannel.send('PotatoBot, reporting for duty!');
  } catch (error) {
    console.error(error);
  }
});

client.on('message', receivedMessage => {
  // Prevent bot from responding to its own messages
  try {
    if (
      receivedMessage.author !== client.user &&
      receivedMessage.content.startsWith('!')
    ) {
      processCommand(receivedMessage);
    } else {
      return;
    }
  } catch (error) {
    console.error(error);
  }
});

client.on('error', console.error);

client.login(token);
