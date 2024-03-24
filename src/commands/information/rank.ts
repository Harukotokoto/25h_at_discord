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
  execute: {
    interaction: async ({ client, interaction }) => {
      if (!interaction.guild) return;
      const userId =
        interaction.options.getUser('user')?.id || interaction.user.id;
      const member = interaction.guild.members.cache.get(userId);
      if (!member) return;
      const levelingManager = new Leveling(member);

      const rank = await levelingManager.createCard();

      await interaction.followUp({
        files: [new AttachmentBuilder(rank)],
      });
    },
  },
});