const { REST, Routes } = require('discord.js');
const commands = [
	  {
		      name: 'gpt35translate',
		      description: 'chatgpt 3.5 を利用した翻訳を行います',
		    },
];

let DISCORD_TOKEN = ""
let DISCORD_CLIENT_ID = ""
let CHATGPT_TOKEN = ""

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const axios = require("axios");

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()){
    if (interaction.commandName === 'gpt35translate') {
      const modal = new ModalBuilder()
        .setCustomId('gpt35')
        .setTitle('gpt35');
      const hobbiesInput = new TextInputBuilder()
        .setCustomId('questionsInput')
        .setLabel("please type your request for chatgpt")
        .setStyle(TextInputStyle.Paragraph);
      const firstActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
      modal.addComponents(firstActionRow);
      await interaction.showModal(modal);
    }
  }
  if (interaction.isModalSubmit()){
    var value = interaction.fields.getTextInputValue('questionsInput');
    await interaction.deferReply("chatgpt is thinking...");
    
    let data = {
      model:"gpt-3.5-turbo",
      messages: [
	{ "role":"user","content":"次に話す内容を英語に翻訳してください。" },
	{ "role":"user","content":value }
      ],
      temperature:0
    }

    let headers = {
      "Content-Type":'application/json',
      "Authorization":`Bearer ${CHATGPT_TOKEN}`
    }

    var gptres = await axios.post("https://api.openai.com/v1/chat/completions", data, {headers: headers})
    var gptresponse = gptres.data.choices[0].message.content;
    value = value.replace("\n","\n> ")
    var message = `> ${value}\n` + gptresponse;
    await interaction.followUp(message);
  }
});

client.login(DISCORD_TOKEN);
