// Import dependencies
const { Client } = require('discord.js-selfbot-v13');
const puppeteer = require('puppeteer');
const express = require('express');

// Initialize Discord client and express app
const client = new Client({
  checkUpdate: false
});
const app = express();

// Environment variables
const token = process.env.TOKEN;
const channelID = process.env.CHANNEL_ID;
const guildID = process.env.GUILD_ID;

// Set up the express server
app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port 3000');
});

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);

  try {
    // Launch browser instance in headless mode for Render compatibility
    const browser = await puppeteer.launch({
      headless: true, // Using standard headless mode for better Render compatibility
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
    });

    const page = await browser.newPage();

    // Navigate to Discord and inject token
    await page.goto('https://discord.com/login', { waitUntil: 'networkidle2' });
    await page.evaluate((token) => {
      window.localStorage.setItem('token', `"${token}"`);
    }, token);

    await page.reload({ waitUntil: 'networkidle2' });

    // Navigate to the specific channel
    await page.goto(`https://discord.com/channels/${guildID}/${channelID}`, { waitUntil: 'networkidle2' });

    // Automate the process of joining the voice channel and starting screen share
    await page.waitForSelector('button[aria-label="Join Voice"]', { visible: true });
    await page.click('button[aria-label="Join Voice"]');

    // Wait for the join process to complete
    await page.waitForTimeout(5000);

    await page.waitForSelector('button[aria-label="Share Your Screen"]', { visible: true });
    await page.click('button[aria-label="Share Your Screen"]');

    // Wait before clicking "Go Live"
    await page.waitForTimeout(2000);
    await page.click('button[aria-label="Go Live"]');

    console.log('Screen sharing started on a black screen!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
});

// Log in with Discord token
client.login(token);
