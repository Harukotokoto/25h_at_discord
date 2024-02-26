import { Command } from '../../lib/modules/Command';
import axios from 'axios';
import { ApplicationCommandType, ChannelType, Colors } from 'discord.js';
import { footer } from '../../lib/utils/embed';
import { client } from '../../index';
import { CommandError } from '../../lib/modules/classes/CommandError';

export default new Command({
  name: 'Make it a Quote',
  type: ApplicationCommandType.Message,
  execute: {
    interaction: async ({ interaction }) => {
      if (!interaction.targetMessage.content) {
        return await interaction.followUp({
          embeds: [
            {
              title: 'エラーが発生しました',
              description: 'そのメッセージにはテキストが含まれていません',
              color: Colors.Red,
              footer: footer(),
            },
          ],
        });
      }

      const member = interaction.guild?.members.cache.get(
        interaction.targetMessage.author.id
      );

      const Error = new CommandError(interaction);

      if (!member) {
        return await Error.create('サーバー内にメンバーが存在しません');
      }

      const response = (
        await axios.post('https://api.voids.top/fakequote', {
          text: interaction.targetMessage.content,
          avatar: member.displayAvatarURL(),
          username: member.user.tag,
          display_name: member.displayName,
          color: true,
          watermark: client.user?.tag,
        })
      ).data;

      const imageBuffer = await axios.get(response.url, {
        responseType: 'arraybuffer',
      });

      const imageBinary = Buffer.from(imageBuffer.data, 'binary');

      await interaction.followUp({
        content: `[生成元のメッセージ](${interaction.targetMessage.url})`,
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
