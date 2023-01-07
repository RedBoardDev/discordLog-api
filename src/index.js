const express = require('express');
const Discord = require('discord.js');
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });
client.login(process.env.DISCORD_BOT_TOKEN);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/log/:app", async (req, res) => {
    if (!req.params.hasOwnProperty('app') || !req.body.hasOwnProperty('message')) {
        res.status(400).json({ msg: "Bad parameter" });
        return;
    }
    const type = req.params.type;
    const data = req.body.message;
    const message = "[" + type + "] " + data.toString();
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    channel.send(message).then(() => {
        res.status(200).send('Message send');
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});

app.get("/", (req, res) => {
    res.send("discordLog-API");
});

const host = process.env.API_HOST;
const port = process.env.API_PORT;
app.listen(port, host, () => {
    console.log(`Relay server started at http://${host}:${port}`);
});
