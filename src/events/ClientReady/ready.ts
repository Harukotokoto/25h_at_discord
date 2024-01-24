import { Event } from '../../lib/modules/Event';
import { client } from '../../index';
import { Events } from 'discord.js';

export default new Event(Events.ClientReady, async () => {
  client.Logger.info(`\x1b[32m${client.user?.tag} is now ready!\x1b[0m`)
});
