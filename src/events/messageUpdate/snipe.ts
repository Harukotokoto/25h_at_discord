import { Event } from '../../lib/modules/Event';
import { client } from '../../index';

export default new Event('messageUpdate', async (oldMessage, newMessage) => {
  if (!oldMessage.content && !newMessage.attachments) return;
  if (oldMessage.content === newMessage.content) return;
  client.edit_snipes.set(newMessage.channel.id, { newMessage, oldMessage });
});
