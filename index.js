const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const express = require("express");

const client = new Client();
const app = express();
const listener = app.listen(process.env.PORT || 2000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.get('/', (req, res) => {
  res.send(`
    <body>
      <center><h1>Bot 24H ON!</h1></center>
    </body>
  `);
});

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
  const channelId = process.env.channel; // Set your channel ID here
  const guildId = process.env.guild; // Set your guild ID here

  const channel = await client.channels.fetch(channelId);
  
  // Join voice channel
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: guildId,
    selfMute: false,
    selfDeaf: false,
    adapterCreator: channel.guild.voiceAdapterCreator
  });

  // Create audio player
  const player = createAudioPlayer();
  connection.subscribe(player);

  // Play the YouTube video
  const stream = ytdl('https://youtu.be/VGRQGm4-A4k', { filter: 'audioonly' });
  const resource = createAudioResource(stream);

  player.play(resource);

  player.on('error', error => {
    console.error(`Error: ${error.message}`);
  });
});

client.login(process.env.token);
