import { Event } from '../../lib/modules/Event';
import { ChannelType } from 'discord.js';
import { client } from '../../index';

const config_model = client.models.config;

export default new Event('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  const config = await config_model.findOne({ GuildID: message.guild.id });

  if (!config || !config.Publish || !config.Publish.ChannelID) return;

  if (config.Publish.status) {
    if (
      message.channel.type === ChannelType.GuildAnnouncement &&
      message.channel.id === config.Publish.ChannelID
    ) {
      if (message.crosspostable) {
        await message.crosspost();
      }
    }
  }
});
