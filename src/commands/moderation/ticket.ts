import { Command } from '../../lib/modules/Command';
import {
  ApplicationCommandOptionType,
  ButtonStyle,
  ChannelType,
  Colors,
  ComponentType,
} from 'discord.js';
import { footer } from '../../lib/utils/embed';
import { randomUUID } from 'node:crypto';

export default new Command({
  name: 'ticket',
  description: 'Ticket System',
  requiredPermissions: ['ManageGuild'],
  options: [
    {
      name: 'setup',
      description: 'チケットをセットアップします',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'category',
          description: 'チケットを作成するカテゴリー',
          type: ApplicationCommandOptionType.Channel,
          channelTypes: [ChannelType.GuildCategory],
          required: true,
        },
        {
          name: 'staff',
          description: 'スタッフのロール',
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const ticket_setup_model = client.models.ticket_setup;

      switch (interaction.options.getSubcommand()) {
        case 'setup':
          await ticket_setup_model.create({
            MessageID: (await interaction.fetchReply()).id,
            Category: interaction.options.getChannel('category', true, [
              ChannelType.GuildCategory,
            ]).id,
            TicketID: randomUUID(),
            StaffRoleID: interaction.options.getRole('staff', true).id,
          });

          await interaction.followUp({
            embeds: [
              {
                title: 'チケットを発行',
                description:
                  'ボタンをクリックしてスタッフとの専用のチャンネルを作成し、サポートに連絡することができます',
                color: Colors.Blue,
                footer: footer(),
              },
            ],
            components: [
              {
                type: ComponentType.ActionRow,
                components: [
                  {
                    type: ComponentType.Button,
                    label: 'チケットを作成',
                    emoji: '📩',
                    style: ButtonStyle.Secondary,
                    customId: 'ticket_button',
                  },
                ],
              },
            ],
          });
          break;
      }
    },
  },
});
