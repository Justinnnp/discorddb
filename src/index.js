require("dotenv").config();
const discord = require("discord.js");
const client = new discord.Client();

const { registerCommands, registerEvents } = require("./utils/register");

client.on('ready', () => {
    console.log("online!");
});

(async () => {
    await client.login(process.env.BOT_TOKEN);
    client.commands = new Map();
    await registerCommands(client, '../commands');
    await registerEvents(client, "../events");
})();