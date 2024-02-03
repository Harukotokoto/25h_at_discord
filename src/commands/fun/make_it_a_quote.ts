import { Command } from '../../lib/modules/Command';
import axios from 'axios';
import { ApplicationCommandType, ChannelType, Colors } from 'discord.js';
import { footer } from '../../lib/utils/Embed';
import { client } from '../../index';

export default new Command({
  name: 'Make it a Quote',
  type: ApplicationCommandType.Message,
  execute: {
    interaction: async ({ interaction }) => {
      if (!interaction.targetMessage) {
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

      const response = (
        await axios.post('https://api.voids.top/fakequote', {
          text: interaction.targetMessage.content,
          avatar: interaction.targetMessage.author.displayAvatarURL(),
          username: interaction.targetMessage.author.tag,
          display_name: interaction.targetMessage.author.displayName,
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

      const target_channel = interaction.guild?.channels.cache.get(
        '1203209546319921243'
      );
      if (!target_channel || target_channel.type !== ChannelType.GuildText)
        return;

      await target_channel.send({
        embeds: [
          {
            description: `[元メッセージへ飛ぶ](${interaction.targetMessage.url})`,
            image: {
              url: 'attachment://quote.jpg',
            },
          },
        ],
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
