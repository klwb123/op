const { Client } = require('discord.js-selfbot-v13');
const puppeteer = require('puppeteer');  // Ensure this is puppeteer, not puppeteer-core
const express = require('express');

const client = new Client();
const app = express();

// Environment variables for token and Discord setup
const token = process.env.TOKEN;
const channelID = process.env.CHANNEL_ID;
const guildID = process.env.GUILD_ID;

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Keep the bot alive by responding to HTTP requests
app.get('/', (req, res) => {
  res.send('Bot is running.');
});

// Discord client ready event
client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);

  // Puppeteer automation for screen sharing on Discord
  const browser = await puppeteer.launch({
    headless: false, // Disable headless mode for full interaction with Discord
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Necessary for running on Render
  });

  const page = await browser.newPage();

  // Log into Discord using token
  await page.goto('https://discord.com/channels/@me', { waitUntil: 'networkidle2' });

  // Inject the token directly to log in
  await page.evaluate((token) => {
    window.localStorage.setItem('token', `"${token}"`);
  }, token);

  // Reload the page to be authenticated
  await page.reload({ waitUntil: 'networkidle2' });

  // Go to the server and join the voice channel
  await page.goto(`https://discord.com/channels/${guildID}/${channelID}`, { waitUntil: 'networkidle2' });

  // Click the "Join Voice" button
  await page.waitForSelector('button[aria-label="Join Voice"]', { visible: true });
  await page.click('button[aria-label="Join Voice"]');

  // Click the "Share Your Screen" button
  await page.waitForSelector('button[aria-label="Share Your Screen"]', { visible: true });
  await page.click('button[aria-label="Share Your Screen"]');

  // Wait and confirm the screen share (black screen)
  await page.waitForTimeout(2000); // Wait for 2 seconds
  await page.click('button[aria-label="Go Live"]');

  console.log('Screen sharing started on a black screen!');
});

// Start the Discord selfbot
client.login(token);
