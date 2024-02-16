import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { codeBlock } from '@discordjs/builders';
import { footer } from '../../lib/utils/Embed';

export default new Command({
  name: 'admin',
  description: 'adminの状態を切り替えます',
  private: true,
  execute: {
    interaction: async ({ interaction, client }) => {
      const admin = ['1176812229631430660', '1004365048887660655', '1047017417093685279'];
      if (!admin.includes(interaction.user.id)) {
        return interaction.reply({ content: 'adminのみ実行可能です', ephemeral: true });
      }
      const executorMember = await interaction.guild.members.fetch(interaction.user.id);
      const hasAdminRole = executorMember.roles.cache.has('1208105713419817042');
      const action = hasAdminRole ? '剥奪' : '付与';
      await executorMember.roles[hasAdminRole ? 'remove' : 'add']('1208105713419817042');
      await interaction.reply({ content: `adminを${action}しました`, ephemeral: true });
    },
  },
});
