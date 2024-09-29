require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Selfbot is online!');
});

client.on('messageCreate', message => {
    if (!message.author.bot && message.content.includes('bobo')) {
        message.reply('lolo');
    }
});

client.login(process.env.TOKEN);
