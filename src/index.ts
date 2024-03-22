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
