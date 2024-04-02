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

process.on('uncaughtException', async (e) => client.Logger.error(e));

process.on('unhandledRejection', async (e) => client.Logger.error(e));
