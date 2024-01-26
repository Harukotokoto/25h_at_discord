import { Event } from '../../lib/modules/Event';
import { ChannelType, Colors } from 'discord.js';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith('delete_message')) {
    const [customId, channelId, messageId] = interaction.customId.split("-");
    const channel = interaction.guild?.channels.cache.get(channelId);
    if (!channel || channel.type !== ChannelType.GuildText) return;

    const message = channel.messages.cache.get(messageId);
    if (message) {
      await message.delete();
    }

    await interaction.message.delete();

    const embed = interaction.message.embeds[0];

    return await interaction.channel?.send({
      embeds: [
        {
          title: 'メッセージを削除しました',
          author: {
            name: embed.author?.name || '',
            icon_url: embed.author?.iconURL,
          },
          description: embed.description || '',
          fields: embed.fields,
          color: Colors.Green,
          footer: {
            text: embed.footer?.text || '',
          },
        },
      ],
    });
  }

  if (interaction.customId === "dismiss_report") {
    await interaction.message.delete()
  }
});
