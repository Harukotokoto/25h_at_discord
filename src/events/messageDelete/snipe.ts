import { Event } from '../../lib/modules/Event';
import { client } from '../../index';

export default new Event('messageDelete', async (message) => {
  if (!message.content && !message.attachments) return;
  client.snipes.set(message.channel.id, message);
});
