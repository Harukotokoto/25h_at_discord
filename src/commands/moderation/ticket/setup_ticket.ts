import {
  ButtonStyle,
  ChatInputCommandInteraction,
  Colors,
  ComponentType,
  GuildTextBasedChannel,
  Role,
} from 'discord.js';
import { ticket_setup } from '../../../lib/models/ticketSetup';
import { footer } from '../../../lib/utils/Embed';
import { CommandError } from '../../../lib/utils/CommandError';

export const setup_ticket = async ({
  interaction,
}: {
  interaction: ChatInputCommandInteraction;
}) => {
  const Error = new CommandError(interaction);
  const staff_role = interaction.options.getRole('staff_role') as Role;
  const feedback_channel = interaction.options.getChannel(
    'feedback_channel'
  ) as GuildTextBasedChannel;
  const ticket_channel = interaction.options.getChannel(
    'ticket_channel'
  ) as GuildTextBasedChannel;
  const ticket_type = interaction.options.getString('ticket_type') as
    | 'button'
    | 'modal';

  const setup_ticket = await ticket_setup.findOne({
    TicketChannelID: interaction.channel?.id,
  });

  if (setup_ticket) {
    return Error.create('このチャンネルでは既にチケットを作成しています');
  } else {
    await ticket_setup.create({
      GuildID: interaction.guild?.id,
      TicketChannelID: interaction.channel?.id,
      FeedbackChannelID: feedback_channel.id,
      StaffRoleID: staff_role.id,
      TicketType: ticket_type,
    });
  }

  if (ticket_type === 'button') {
    await ticket_channel.send({
      embeds: [
        {
          title: 'Ticket System',
          description: 'ボタンをクリックしてチケットを作成します',
          color: Colors.Green,
          footer: footer(),
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: 'チケットを開く',
              style: ButtonStyle.Secondary,
              customId: 'support_ticket_button',
            },
          ],
        },
      ],
    });
  } else {
    await ticket_channel.send({
      embeds: [
        {
          title: 'Ticket System',
          description: 'ボタンをクリックしてチケットを作成します',
          color: Colors.Green,
          footer: footer(),
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: 'チケットを開く',
              style: ButtonStyle.Secondary,
              customId: 'support_ticket_button',
            },
          ],
        },
      ],
    });
  }

  await interaction.followUp({
    embeds: [
      {
        title: 'Ticket System Setup',
        description: '以下の設定でチケットを作成しました:',
        fields: [
          {
            name: 'Ticket Channel',
            value: `${ticket_channel}`,
            inline: true,
          },
          {
            name: 'Feedback Channel',
            value: `${feedback_channel}`,
            inline: true,
          },
          {
            name: 'Staff Role',
            value: `${staff_role}`,
            inline: true,
          },
          {
            name: 'Ticket Type',
            value: `${ticket_type}`,
            inline: true,
          },
        ],
        color: Colors.Aqua,
        footer: footer(),
      },
    ],
  });
};
