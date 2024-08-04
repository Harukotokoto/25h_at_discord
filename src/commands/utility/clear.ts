import { Command } from '../../lib/modules/Command';
import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  Colors, Message,
} from 'discord.js';
import { footer } from '../../lib/utils/embed';
import { CommandError } from '../../lib/modules/classes/CommandError';

export default new Command({
  name: 'clear',
  aliases: ['c', 'purge'],
  description: 'チャンネル内のメッセージをパージします',
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

      await interaction.followUp({
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
    message: async ({ client, message, args }) => {
      const clear = await clearMessages_Message(message, args);

      if (clear) {
        await message.reply({
          embeds: [
            {
              title: 'メッセージをパージしました',
              description: `最大${parseInt(args[0])}件のメッセージをパージしました\n※古いメッセージなどは削除できない場合があります。`,
              color: Colors.Green,
              footer: footer(),
            },
          ],
        })
      }
    }
  },
});

async function clearMessages_Interaction(interaction: ChatInputCommandInteraction) {
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

async function clearMessages_Message(message: Message, args: string[]) {
  let total_deleted = 0;
  const count = parseInt(args[0])
  const Error = new CommandError(message)

  if (isNaN(count) || count <= 0) {
    await Error.create("有効な数値を入力してください")
    return false;
  }

  if (!message.channel) return false;
  if (
    message.channel.type !== ChannelType.GuildText &&
    message.channel.type !== ChannelType.GuildAnnouncement
  )
    return false;

  while (total_deleted < count) {
    const messages = await message.channel.messages.fetch({
      limit: 100,
    });
    if (messages.size === 0) {
      break;
    }

    const toDelete =
      messages.size > count - total_deleted
        ? count - total_deleted
        : messages.size;
    const messagesToDelete = messages.first(toDelete);

    await message.channel.bulkDelete(messagesToDelete, true);
    total_deleted += toDelete;
  }


  return true;
}
