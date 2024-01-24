require('dotenv').config();
import { ExtendedClient } from './lib/modules/ExtendedClient';

export const client = new ExtendedClient({
  intents: ['Guilds', 'GuildMessages', 'GuildMembers'],
  allowedMentions: {
    parse: []
  },

});
