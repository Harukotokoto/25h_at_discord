require('dotenv').config();
import { ExtendedClient } from './lib/modules/ExtendedClient';

export const client = new ExtendedClient({
  intents: [
    'Guilds',
    'GuildMessages',
    'MessageContent',
  ],
  allowedMentions: {
    parse: [],
  },
});

console.clear();
client.start();

process.on('uncaughtException', async (e) => client.Logger.error(e));

process.on('unhandledRejection', async (e) => client.Logger.error(e));
