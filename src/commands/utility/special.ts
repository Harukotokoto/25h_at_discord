import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Command({
  name: 'special',
  description: '指定したユーザーにspecialロールを付与します',
  requiredPermissions: ['Administrator'],
  private: true,
  options: [
    {
      name: 'user',
      description: '@user',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const targetUser = interaction.options.getUser('user');
      if (!targetUser) return;
      const roleId = '1180691750164123688';

      const member = interaction.guild?.members.cache.get(targetUser.id);

      if (!member) return;

      await member.roles.add(roleId);
      await interaction.followUp({
        embeds: [
          {
            title: 'special add',
            description: `> ユーザー ${targetUser.tag} にロールが付与されました。\n> 付与されたロール <@&${roleId}>`,
            footer: footer(),
            color: Colors.Aqua,
          },
        ],
      });
    },
  },
});
