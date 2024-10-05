const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require("express");

const client = new Client(); 
const app = express();
const channelID = process.env.channel;
const guildID = process.env.guild;
const token = process.env.token;

var listener = app.listen(process.env.PORT || 2000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.listen(() => console.log("I'm Ready To Work..! 24H"));
app.get('/', (req, res) => {
  res.send(`
  <body>
  <center><h1>Bot 24H ON!</h1></center>
  </body>`);
});

client.on('ready', () => {
  console.log(`${client.user.username} is ready!`);

  // Join the voice channel when the bot is ready
  joinVoiceChannel({
    channelId: channelID, 
    guildId: guildID, 
    selfMute: false,
    selfDeaf: false,
    adapterCreator: client.guilds.cache.get(guildID).voiceAdapterCreator,
  });
});

// Event listener for when the bot is disconnected or kicked from a voice channel
client.on('voiceStateUpdate', (oldState, newState) => {
  // Check if the bot was in a voice channel and has been kicked or disconnected
  if (oldState.channelId && !newState.channelId && oldState.member.id === client.user.id) {
    console.log('Kicked from voice channel. Rejoining in 3 minutes...');
    setTimeout(() => {
      client.channels.fetch(channelID)
        .then((channel) => {
          joinVoiceChannel({
            channelId: channel.id,
            guildId: guildID,
            selfMute: false,
            selfDeaf: false,
            adapterCreator: channel.guild.voiceAdapterCreator,
          });
          console.log('Rejoined the voice channel!');
        })
        .catch(console.error);
    }, 180000); // 3 minutes = 180000 ms
  }
});

client.login(token);
