import { Event } from '../../lib/modules/Event';
import { gchat_model } from '../../lib/models/gchat';
import {
  AttachmentBuilder,
  ChannelType,
  Colors,
  WebhookClient,
} from 'discord.js';
import { client } from '../../index';
import { messages_model } from '../../lib/models/messages';

export default new Event('messageDelete', async (message) => {
  if (message.author?.bot || !message.guild || !message.channel) return;

  const data = await messages_model.findOne({
    MessageID: message.id,
  });

  if (!data) return;

  data.SentMessages.forEach((msg) => {
    const channel = client.channels.cache.get(msg.ChannelID);
    if (!channel || channel.type !== ChannelType.GuildText) return;

    channel.messages.fetch(msg.MessageID).then((msg) => {
      msg.delete();
    });
  });

  await messages_model.deleteOne({
    MessageID: message.id,
  });
});
