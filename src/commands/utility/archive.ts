import { Command } from '../../lib/modules/Command';
import {
  ApplicationCommandOptionType,
  ChannelType,
  Colors,
  GuildChannel,
} from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Command({
  name: 'archive',
  description: '指定したチャンネルをアーカイブします',
  requiredPermissions: ['ManageChannels'],
  private: true,
  options: [
    {
      name: 'channel',
      description: '<#Channel>',
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [
        ChannelType.GuildForum,
        ChannelType.GuildText,
        ChannelType.GuildAnnouncement,
        ChannelType.GuildVoice,
        ChannelType.GuildStageVoice,
      ],
      required: false,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const target_channel =
        interaction.options.getChannel('channel') || interaction.channel;
      const selected_channel = interaction.guild?.channels.cache.get(
        target_channel?.id as string
      ) as GuildChannel;

      if (!target_channel || !selected_channel) return;

      if (!selected_channel) return;

      const archives_category = interaction.guild?.channels.cache.get(
        '1176827301049139252'
      );

      if (
        !archives_category ||
        archives_category.type !== ChannelType.GuildCategory
      )
        return;

      await selected_channel
        .setParent(archives_category, {
          lockPermissions: true,
        })
        .then(async () => {
          await interaction
            .followUp({
              embeds: [
                {
                  title: 'チャンネルをアーカイブしました',
                  description: `<#${target_channel?.id}>をアーカイブしました`,
                  color: Colors.Aqua,
                  footer: footer(),
                },
              ],
            })
            .catch(async () => {
              await interaction.followUp({
                embeds: [
                  {
                    title: 'チャンネルのアーカイブに失敗しました',
                    description: 'エラーの原因が権限不足の場合が多いです',
                    color: Colors.Aqua,
                    footer: footer(),
                  },
                ],
              });
            });
        });
    },
  },
});
