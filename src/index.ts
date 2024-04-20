import { SimpleShardingStrategy } from 'discord.js';

require('dotenv').config();
import { ExtendedClient } from './lib/modules/ExtendedClient';

export const client = new ExtendedClient({
  ws: {
    buildStrategy: (manager) => {
      return new (class MobileSimpleShardingStrategy extends SimpleShardingStrategy {
        constructor(manager: any) {
          manager.options.identifyProperties = {
            os: 'ios',
            device: 'device',
            browser: 'Discord iOS',
          };
          super(manager);
        }
      })(manager);
    },
  },
  intents: ['Guilds', 'GuildMessages', 'MessageContent'],
  allowedMentions: {
    parse: [],
  },
});

console.clear();
client.start();

process.on('uncaughtException', async (e) => client.Logger.error(e));

process.on('unhandledRejection', async (e) => client.Logger.error(e));
