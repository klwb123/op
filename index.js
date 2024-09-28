const { Client } = require('discord.js-selfbot-v13');
const client = new Client();
const express = require("express");
const app = express();

app.listen(process.env.PORT || 2000, () => {
  console.log('Your app is listening on port ' + (process.env.PORT || 2000));
});

app.get('/', (req, res) => {
  res.send('<body><center><h1>Bot 24H ON!</h1></center></body>');
});

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
  
  const channel = await client.channels.fetch(process.env.channel);
  
  // Start screen share (replace with actual screen share logic)
  channel.join().then(connection => {
    // Here, you'd implement logic to share a black screen
    console.log('Screen sharing started with black screen.');
  }).catch(console.error);
});

client.login(process.env.token);
