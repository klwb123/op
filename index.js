const { Client } = require('discord.js-selfbot-v13');
const client = new Client();
const express = require("express");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const app = express();
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

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
});

const playMusic = async (channelId, guildId, url) => {
  const connection = joinVoiceChannel({
    channelId: channelId,
    guildId: guildId,
    selfMute: false,
    selfDeaf: false,
    adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator,
  });

  const player = createAudioPlayer();
  const resource = createAudioResource(ytdl(url, { filter: 'audioonly' }));

  player.play(resource);
  connection.subscribe(player);

  player.on('error', error => {
    console.error(`Error: ${error.message}`);
  });

  player.on('idle', () => {
    connection.destroy();
  });
};

// Example: Play music when the bot is ready
client.on('ready', () => {
  setInterval(async () => {
    const channel = await client.channels.fetch(process.env.channel);
    if (channel) {
      // Replace with a valid YouTube URL
      const youtubeUrl = 'https://youtu.be/U36il97iEI0?si=UL-4W27qDl49t8_E';
      playMusic(channel.id, process.env.guild, youtubeUrl);
    }
  }, 1000);
});

client.login(process.env.token);
