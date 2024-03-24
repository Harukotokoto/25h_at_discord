import { Command } from '../../lib/modules/Command';
import { ApplicationCommandType, Colors } from 'discord.js';
import { client } from '../../index';
import { CommandError } from '../../lib/modules/classes/CommandError';
import { Quote } from '../../lib/modules/classes/Quote';

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
        message.embeds[0].image?.url.startsWith('https://25dsnipe.com/') &&
        message.embeds[0].description
      ) {
        const memberId = message.embeds[0].image.url.split(
          'https://25dsnipe.com/'
        )[1];
        const member = interaction.guild.members.cache.get(memberId);
        if (!member) {
          return await Error.create('サーバー内にメンバーが存在しません');
        }

        const quote = await new Quote()
          .setText(
            message.embeds[0].color === Colors.Aqua
              ? message.embeds[0].description
              : message.embeds[0].description.split(' => ')[0]
          )
          .setAvatarURL(member.displayAvatarURL())
          .setUsername(member.user.tag)
          .setDisplayName(member.displayName)
          .setColor()
          .setWatermark(client.user?.tag || '')
          .build();

        await interaction.followUp({
          content: `[Snipeから作成](${message.url})`,
          files: [
            {
              attachment: quote.binary,
              name: 'quote.jpg',
            },
          ],
        });
      } else {
        if (!message.content) {
          return await Error.create(
            'そのメッセージにはテキストが含まれていません'
          );
        }

        const member = interaction.guild?.members.cache.get(message.author.id);
        if (!member) {
          return await Error.create('サーバー内にメンバーが存在しません');
        }

        const quote = await new Quote()
          .setText(message.content)
          .setAvatarURL(member.displayAvatarURL())
          .setUsername(member.user.tag)
          .setDisplayName(member.displayName)
          .setColor()
          .setWatermark(client.user?.tag || '')
          .build();

        await interaction.followUp({
          content: `[生成元のメッセージ](${message.url})`,
          files: [
            {
              attachment: quote.binary,
              name: 'quote.jpg',
            },
          ],
        });
      }
    },
  },
});
