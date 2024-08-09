import { Event } from '../../lib/modules/Event';
import {
  ButtonStyle,
  ChannelType,
  Colors,
  ComponentType,
  OverwriteType,
  PermissionsBitField,
  TextInputStyle,
} from 'discord.js';
import { footer } from '../../lib/utils/embed';
import { ticket_setup_model } from '../../lib/models/ticket_setup';
import { Ticket } from '../../lib/modules/classes/Ticket';

const ticket = new Ticket();

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
      const reply = await interaction.reply({
        content: '5秒後にチケットを閉じます',
      });

      setTimeout(async () => {
        await ticket.close(interaction);
        await reply.delete();
      }, 5000);
    }

    if (interaction.customId === 'reopen-ticket') {
      await ticket.reopen(interaction);
    }

    if (interaction.customId === 'write-logs') {
      await ticket.writeLogs(interaction);
    }

    if (interaction.customId === 'delete-ticket') {
      await ticket.deleteChannel(interaction);
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith('ticket_modal')) {
      const newChannel = await ticket.create(interaction);

      if (!newChannel) {
        return;
      }

      await interaction.reply({
        content: `チケットを作成しました <#${newChannel}>`,
        ephemeral: true,
      });
    }
  }
});
