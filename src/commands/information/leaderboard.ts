import { Command } from '../../lib/modules/Command';
import { Colors } from 'discord.js';
import { Leveling } from '../../lib/modules/classes/Leveling';
import { footer } from '../../lib/utils/embed';

export default new Command({
  name: 'leaderboard',
  description: '上位10名を表示します',
  aliases: ['top', 'lb'],
  execute: {
    interaction: async ({ client, interaction }) => {
      if (!interaction.guild) return;
      const top10 = await Leveling.getTop10(interaction.guild.id);

      await interaction.followUp({
        embeds: [
          {
            title: 'Leaderboard',
            description: top10
              .map((user, index) => {
                return `${index + 1}. <@!${user.UserID}> - Level **${user.Level}**`;
              })
              .join('\n'),
            color: Colors.Aqua,
            footer: footer(),
          },
        ],
      });
    },
    message: async ({ client, message, args }) => {
      if (!message.guild) return;
      const top10 = await Leveling.getTop10(message.guild.id);

      await message.reply({
        embeds: [
          {
            title: 'Leaderboard',
            description: top10
              .map((user, index) => {
                return `${index + 1}. <@!${user.UserID}> - Level **${user.Level}**`;
              })
              .join('\n'),
            color: Colors.Aqua,
            footer: footer(),
          },
        ],
      });
    },
  },
});
