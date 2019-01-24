const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('Connected as ' + client.user.tag);
  console.log('Servers:');
  client.guilds.forEach((guild) => {
      console.log(' - ' + guild.name)
      guild.channels.forEach((channel) => {
          console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
      })
  })
  const botChannel = client.channels.get('537707944083456029');
  botChannel.send('PotatoBot, reporting for duty!');

});

const botSecretToken =
  'NTM3NzA4MjkxNzQ1MTIwMjU3.DypMCA.lMzjkvCzMHAteDrCzjN4xo5Q_pg';

client.login(botSecretToken);
