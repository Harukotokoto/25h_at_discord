import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Command({
  name: 'verify',
  description: '指定したユーザーを手動で認証します',
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
      const roleId = client.config.member

      const member = interaction.guild?.members.cache.get(targetUser.id);

      if (!member) return;

      await member.roles.add(roleId);
      await interaction.followUp({
        embeds: [
          {
            title: 'ユーザー認証完了',
            description: `> ユーザー ${targetUser.tag} が認証されました。\n> 付与されたロール <@&${roleId}>`,
            footer: footer(),
            color: Colors.Aqua,
          },
        ],
      });
    },
  },
});
