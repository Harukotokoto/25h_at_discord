import { Command } from '../../lib/modules/Command';
import axios from 'axios';
import { ApplicationCommandType, ChannelType, Colors, User } from 'discord.js';
import { footer } from '../../lib/utils/embed';
import { client } from '../../index';
import { CommandError } from '../../lib/modules/classes/CommandError';
import { randomUUID } from 'node:crypto';

export default new Command({
  name: 'Make it a Quote',
  type: ApplicationCommandType.Message,
  execute: {
    interaction: async ({ interaction }) => {
      if (!interaction.guild) return;
      const message = interaction.targetMessage;
      const Error = new CommandError(interaction);

      if (
        message.embeds[0] &&
        message.author.id === client.user?.id &&
        message.embeds[0].description &&
        message.embeds[0].author &&
        message.embeds[0].timestamp &&
        message.embeds[0].image &&
        message.embeds[0].image.url.startsWith('https://25dsnipe.com/')
      ) {
        const memberId = message.embeds[0].image.url.split(
          'https://25dsnipe.com/'
        )[1];
        const member = interaction.guild.members.cache.get(memberId);
        if (!member) {
          return await Error.create('サーバー内にメンバーが存在しません');
        }

        const response = (
          await axios.post('https://api.voids.top/fakequote', {
            text:
              message.embeds[0].color === Colors.Aqua
                ? message.embeds[0].description
                : message.embeds[0].description.split(' => ')[0],
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
          content: `[Snipeから作成](${message.url})`,
          files: [
            {
              attachment: imageBinary,
              name: 'quote.jpg',
            },
          ],
        });
      } else {
        if (!message.content) {
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

        const member = interaction.guild?.members.cache.get(message.author.id);

        if (!member) {
          return await Error.create('サーバー内にメンバーが存在しません');
        }

        const response = (
          await axios.post('https://api.voids.top/fakequote', {
            text: message.content,
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
          content: `[生成元のメッセージ](${message.url})`,
          files: [
            {
              attachment: imageBinary,
              name: 'quote.jpg',
            },
          ],
        });
      }
    },
  },
});
