import { ChannelType, codeBlock, Colors } from 'discord.js';

require('dotenv').config();
import { ExtendedClient } from './lib/modules/ExtendedClient';
import { footer } from './lib/utils/embed';

export const client = new ExtendedClient({
  intents: [
    'Guilds',
    'GuildMessages',
    'GuildMembers',
    'MessageContent',
    'GuildVoiceStates',
    'GuildEmojisAndStickers',
  ],
  allowedMentions: {
    parse: [],
  },
});

console.clear();
client.start();

const sendError = async (error: any) => {
  const channel = client.channels.cache.get(process.env.ERROR_LOG);
  if (!channel || channel.type !== ChannelType.GuildText) return;

  await channel.send({
    embeds: [
      {
        title: 'エラーが発生しました',
        description: codeBlock(error as string),
        color: Colors.Red,
        footer: footer(),
      },
    ],
  });
};

client.on('ready', () => {
  const colors = ['#8585ff','#fff681','#a073fd','#fd73b9'];
  const random = Math.floor(Math.random() * colors.length);
  const guild = client.guilds.cache.get("1149350818747781120")
  if (!guild) return;
  const role = guild.roles.cache.get("1224232447563005962")
  if (!role) return;
  
  setInterval(() => {
    role.edit({
      color: colors[random]
    })
  }, 1000);
});

process.on('uncaughtException', async (e) => {
  client.Logger.error(e);
  await sendError(e);
  return;
});

process.on('unhandledRejection', async (e) => {
  client.Logger.error(e);
  await sendError(e);

  return;
});
