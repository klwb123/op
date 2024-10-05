const { Client } = require('discord.js-selfbot-v13');
const puppeteer = require('puppeteer');
const express = require('express');

const client = new Client();
const app = express();

const token = process.env.TOKEN;
const channelID = process.env.CHANNEL_ID;
const guildID = process.env.GUILD_ID;

app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port 3000');
});

client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);

  const browser = await puppeteer.launch({
    headless: false, 
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('https://discord.com/channels/@me', { waitUntil: 'networkidle2' });

  await page.evaluate((token) => {
    window.localStorage.setItem('token', `"${token}"`);
  }, token);

  await page.reload({ waitUntil: 'networkidle2' });

  await page.goto(`https://discord.com/channels/${guildID}/${channelID}`, { waitUntil: 'networkidle2' });

  await page.waitForSelector('button[aria-label="Join Voice"]', { visible: true });
  await page.click('button[aria-label="Join Voice"]');

  await page.waitForSelector('button[aria-label="Share Your Screen"]', { visible: true });
  await page.click('button[aria-label="Share Your Screen"]');

  await page.waitForTimeout(2000);
  await page.click('button[aria-label="Go Live"]');

  console.log('Screen sharing started on a black screen!');
});

client.login(token);
