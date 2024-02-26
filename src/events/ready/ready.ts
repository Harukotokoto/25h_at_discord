import { Event } from '../../lib/modules/Event';
import { client } from '../../index';

export default new Event('ready', async () => {
  client.Logger.info(`\x1b[32m${client.user?.tag} is now ready!\x1b[0m`);
});
