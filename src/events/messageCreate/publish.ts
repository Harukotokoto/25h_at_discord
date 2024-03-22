import { Event } from '../../lib/modules/Event';
import { ChannelType } from 'discord.js';
import { client } from '../../index';
import { publish_model } from '../../lib/models/config';

export default new Event('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  const config = await publish_model.findOne({ GuildID: message.guild.id });

  if (!config) return;

  if (
    message.channel.type === ChannelType.GuildAnnouncement &&
    message.channel.id === config.ChannelID
  ) {
    if (message.crosspostable) {
      await message.crosspost();
    }
  }
});
