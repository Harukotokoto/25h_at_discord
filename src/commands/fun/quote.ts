import { Command } from '../../lib/modules/Command';
import axios from 'axios';
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from 'discord.js';
import { client } from '../../index';
import { CommandError } from '../../lib/modules/classes/CommandError';

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
      const member = interaction.guild?.members.cache.get(user.id);

      const Error = new CommandError(interaction);

      if (!member) {
        return await Error.create('サーバー内にメンバーが存在しません');
      }

      const response = (
        await axios.post('https://api.voids.top/fakequote', {
          text: interaction.options.getString('message', true),
          avatar: member.displayAvatarURL(),
          username: member.user.username,
          display_name: member.displayName,
          color: true,
          watermark: `Fake quote by ${client.user?.tag}`,
        })
      ).data;

      const imageBuffer = await axios.get(response.url, {
        responseType: 'arraybuffer',
      });

      const imageBinary = Buffer.from(imageBuffer.data, 'binary');

      await interaction.followUp({
        files: [
          {
            attachment: imageBinary,
            name: 'quote.jpg',
          },
        ],
      });
    },
  },
});
