import { Command } from '../../lib/modules/Command';
import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  Colors,
  Message,
} from 'discord.js';
import { footer } from '../../lib/utils/embed';
import { CommandError } from '../../lib/modules/classes/CommandError';

export default new Command({
  name: 'clear',
  description: 'チャンネル内のメッセージをパージします',
  requiredPermissions: ['ManageGuild', 'ManageMessages'],
  options: [
    {
      name: 'count',
      description: 'パージするメッセージ数',
      type: ApplicationCommandOptionType.Number,
      required: true,
      minValue: 1,
      maxValue: 1000,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      await clearMessages_Interaction(interaction);

      await interaction.channel?.send({
        embeds: [
          {
            title: 'メッセージをパージしました',
            description: `最大${interaction.options.getNumber('count')}件のメッセージをパージしました\n※古いメッセージなどは削除できない場合があります。`,
            color: Colors.Green,
            footer: footer(),
          },
        ],
      });
    },
  },
});

async function clearMessages_Interaction(
  interaction: ChatInputCommandInteraction
) {
  let total_deleted = 0;
  const count = interaction.options.getNumber('count', true);

  if (!interaction.channel) return;
  if (
    interaction.channel.type !== ChannelType.GuildText &&
    interaction.channel.type !== ChannelType.GuildAnnouncement
  )
    return;

  while (total_deleted < count) {
    const messages = await interaction.channel.messages.fetch({
      limit: 100,
    });

    if (!messages) {
      break;
    }

    if (messages.size === 0) {
      break;
    }

    const toDelete =
      messages.size > count - total_deleted
        ? count - total_deleted
        : messages.size;
    const messagesToDelete = messages.first(toDelete);

    await interaction.channel.bulkDelete(messagesToDelete, true);
    total_deleted += toDelete;
  }
}
