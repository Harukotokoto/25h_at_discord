import { Event } from '../../lib/modules/Event';
import { client } from '../../index';

export default new Event('messageUpdate', async (oldMessage, newMessage) => {
  if (!newMessage.content && !newMessage.attachments) return;
  client.edit_snipes.set(newMessage.channel.id, { newMessage, oldMessage });
});
