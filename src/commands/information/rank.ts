import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js';
import { Leveling } from '../../lib/modules/classes/Leveling';

export default new Command({
  name: 'rank',
  description: 'ランクを表示します',
  options: [
    {
      name: 'user',
      description: 'ランクを表示する対象のユーザー',
      type: ApplicationCommandOptionType.User,
    },
  ],
  aliases: ['level'],
  execute: {
    interaction: async ({ client, interaction }) => {
      if (!interaction.guild) return;
      const userId =
        interaction.options.getUser('user')?.id || interaction.user.id;
      const member = interaction.guild.members.cache.get(userId);
      if (!member) return;
      const levelingManager = new Leveling(member);

      const card = await levelingManager.createCard();

      await interaction.followUp({
        files: [
          {
            attachment: card,
            name: 'card.jpg',
          },
        ],
      });
    },
    message: async ({ client, message, args }) => {
      if (!message.guild) return;
      const userId = message.mentions.users.first()?.id || message.author.id;
      const member = message.guild.members.cache.get(userId);
      if (!member) return;
      const levelingManager = new Leveling(member);

      const card = await levelingManager.createCard();

      await message.reply({
        files: [
          {
            attachment: card,
            name: 'card.jpg',
          },
        ],
      });
    },
  },
});
