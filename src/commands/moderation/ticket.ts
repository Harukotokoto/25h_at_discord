import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import { setup_ticket } from './ticket/setup_ticket';
import { add_member } from './ticket/add-member_ticket';

export default new Command({
  name: 'ticket',
  description: 'チケットシステムを管理します',
  options: [
    {
      name: 'setup',
      description: 'チケットを作成します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'feedback_channel',
          description: 'フィードバックが送信されるチャンネル',
          type: ApplicationCommandOptionType.Channel,
          required: true,
          channel_types: [ChannelType.GuildText],
        },
        {
          name: 'ticket_channel',
          description: 'チケットパネルを作成するチャンネル',
          type: ApplicationCommandOptionType.Channel,
          required: true,
          channel_types: [ChannelType.GuildText],
        },
        {
          name: 'staff_role',
          description: 'チケットスタッフのロール',
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
        {
          name: 'ticket_type',
          description: 'チケットの種類',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: 'Modal', value: 'modal' },
            { name: 'Button', value: 'button' },
          ],
        },
      ],
    },
    {
      name: 'add-member',
      description: 'チケットにメンバーを追加します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'member',
          description: '追加するメンバー',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
  ],
  requiredPermissions: ['ManageGuild'],
  execute: {
    interaction: async ({ client, interaction }) => {
      const cmd = interaction.options.getSubcommand();

      if (cmd === 'setup') await setup_ticket({ interaction });

      if (cmd === 'add-member') await add_member({ interaction });
    },
  },
});
