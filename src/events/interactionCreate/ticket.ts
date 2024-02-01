import { Event } from '../../lib/modules/Event';
import {
  ButtonStyle,
  ChannelType,
  Colors,
  ComponentType,
  PermissionsBitField,
  TextInputStyle,
} from 'discord.js';
import { ticket_setup_model } from '../../lib/models/ticket_setup';
import { footer } from '../../lib/utils/Embed';

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'ticket_button') {
      await interaction.showModal({
        title: 'Support Ticket',
        customId: `ticket_modal-${interaction.message.id}`,
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.TextInput,
                customId: 'topic',
                label: 'タイトル',
                style: TextInputStyle.Short,
                placeholder: '何について問い合わせますか？',
                minLength: 3,
                maxLength: 25,
                required: true,
              },
            ],
          },
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.TextInput,
                customId: 'issue',
                label: '問題',
                style: TextInputStyle.Paragraph,
                placeholder: 'どのような問題が発生していますか',
                minLength: 5,
                maxLength: 250,
                required: true,
              },
            ],
          },
        ],
      });
    }

    if (interaction.customId === 'ticket_close') {
      await interaction.reply({
        content: '5秒後にチケットを削除します',
      });

      setTimeout(async () => {
        await interaction.channel?.delete();
      }, 5000);
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('ticket_modal')) {
      const topic = interaction.fields.getTextInputValue('topic');
      const issue = interaction.fields.getTextInputValue('issue');

      const messageId = interaction.customId.split(/-/g)[1];

      const ticket = await ticket_setup_model.findOne({
        MessageID: messageId,
      });

      if (!ticket) return;

      const staff_role = interaction.guild?.roles.cache.get(ticket.StaffRoleID);

      if (!staff_role) return;

      const channel = await interaction.guild?.channels.create({
        name: `${interaction.user.username}-ticket`,
        type: ChannelType.GuildText,
        parent: ticket.Category,
        permissionOverwrites: [
          {
            id: interaction.guild?.id,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: staff_role.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
      });

      await channel?.send({
        content: `${staff_role.toString()}`,
        embeds: [
          {
            title: 'チケットを作成しました',
            description:
              '```\nチケットを作成しました\nスタッフの対応までお待ちください\n```',
            fields: [
              {
                name: '発行者',
                value: interaction.user.toString(),
              },
              {
                name: 'タイトル',
                value: topic,
              },
              {
                name: '問題',
                value: issue,
              },
            ],
            footer: footer(),
            color: Colors.Blue,
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: 'チケットを閉じる',
                customId: 'close_ticket',
                style: ButtonStyle.Secondary,
              },
            ],
          },
        ],
      });

      await interaction.reply({
        content: `チケットを作成しました ${channel?.toString()}`,
        ephemeral: true,
      });
    }
  }
});
