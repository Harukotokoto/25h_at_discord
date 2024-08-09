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
import { ticket_setup_model } from '../../lib/models/ticket_setup';
import { Ticket } from '../../lib/modules/classes/Ticket';
import { CommandError } from '../../lib/modules/classes/CommandError';

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
      switch (interaction.options.getSubcommand()) {
        case 'setup':
          const ticket = new Ticket();

          const message = await interaction.fetchReply();
          const category = interaction.options.getChannel('category', true, [
            ChannelType.GuildCategory,
          ]);
          const staffRole = interaction.options.getRole('staff', true);

          const panelData = await ticket.setup(
            message.id,
            category.id,
            staffRole.id
          );

          const Error = new CommandError(interaction);
          if (!panelData) {
            return await Error.create();
          }

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
