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

client.login('MTEzNTEzNDI2MTUzMjQzNDUxMw.GX1crJ.6aPCHmM6KnHWQVkQb4BlEPi8dAdnJo7T-E31YI');
