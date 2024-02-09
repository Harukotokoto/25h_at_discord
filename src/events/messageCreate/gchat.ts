import { Event } from '../../lib/modules/Event';
import { gchat_model } from '../../lib/models/gchat';
import { AttachmentBuilder, Colors, WebhookClient } from 'discord.js';
import { client } from '../../index';

export default new Event('messageCreate', async (message) => {
  if (message.author.bot || !message.guild || !message.channel) return;

  if (!message.content && !message.attachments) return;

  const data = await gchat_model.findOne({
    ChannelID: message.channel.id,
  });

  if (!data) return;

  const global_chats = await gchat_model.find();

  global_chats.forEach((data) => {
    if (!data || !data.Webhook) {
      return gchat_model.findOneAndDelete({
        GuildID: data.GuildID,
        ChannelID: data.ChannelID,
      });
    }

    if (data.ChannelID === message.channel?.id) return;

    const channel = client.channels.cache.get(data.ChannelID);
    if (!channel) {
      return gchat_model.deleteMany({
        GuildID: data.GuildID,
        ChannelID: data.ChannelID,
      });
    }

    const hook = new WebhookClient({
      url: data.Webhook.URL,
    });

    try {
      hook.send({
        content: message.content,
        username: `${message.author.displayName} (${message.author.tag})`,
        avatarURL: message.author.displayAvatarURL(),
        allowedMentions: {
          parse: [],
        },
        files: message.attachments.map(
          (attachment) => new AttachmentBuilder(attachment.proxyURL)
        ),
      });
    } catch (e) {
      return e;
    }
  });
});
