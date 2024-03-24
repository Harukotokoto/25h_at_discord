import { Command } from '../../lib/modules/Command';
import axios from 'axios';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Colors,
} from 'discord.js';
import { client } from '../../index';
import { CommandError } from '../../lib/modules/classes/CommandError';
import { Quote } from '../../lib/modules/classes/Quote';

export default new Command({
  name: 'quote',
  description: '名言を捏造します',
  options: [
    {
      name: 'user',
      description: '対象のユーザー',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: 'message',
      description: 'メッセージ',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  type: ApplicationCommandType.ChatInput,
  execute: {
    interaction: async ({ interaction }) => {
      const user = interaction.options.getUser('user', true);
      const content = interaction.options.getString('message', true);
      const member = interaction.guild?.members.cache.get(user.id);

      const Error = new CommandError(interaction);

      if (!member) {
        return await Error.create('サーバー内にメンバーが存在しません');
      }

      const quote = await new Quote()
        .setText(content)
        .setUsername(member.user.username)
        .setDisplayName(member.displayName)
        .setAvatarURL(member.displayAvatarURL())
        .setWatermark(`Fake quote by ${client.user?.tag}`)
        .setColor()
        .build();

      await interaction.followUp({
        files: [
          {
            attachment: quote.binary,
            name: 'quote.jpg',
          },
        ],
      });
    },
    message: async ({ client, message, args }) => {
      const member =
        message.mentions.members?.first() ||
        message.guild?.members.cache.get(args[0]);

      const Error = new CommandError(message);

      if (!member) {
        return await Error.create('サーバー内にメンバーが存在しません');
      }

      const content = message.cleanContent.split(' ').slice(2).join(' ');

      const quote = await new Quote()
        .setText(content)
        .setAvatarURL(member.displayAvatarURL())
        .setUsername(member.user.username)
        .setDisplayName(member.displayName)
        .setColor()
        .setWatermark(`Fake quote by ${client.user?.tag}`)
        .build();

      await message.reply({
        files: [
          {
            attachment: quote.binary,
            name: 'quote.jpg',
          },
        ],
      });
    },
  },
});
