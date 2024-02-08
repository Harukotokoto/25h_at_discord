import { Event } from '../../lib/modules/Event';
import { Colors } from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId === 'reaction_role') {
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    if (!member) return;

    interaction.deferReply({ ephemeral: true });

    const selected_roles = interaction.values;

    for (const roleId of selected_roles) {
      const role = interaction.guild?.roles.cache.get(roleId);

      if (role) {
        if (member.roles.cache.has(role.id)) {
          await member.roles.remove(role);
        } else {
          await member.roles.add(role);
        }
      }
    }

    interaction.followUp({
      embeds: [
        {
          title: `${selected_roles.length}個のロールを更新しました`,
          description: selected_roles
            .map((roleId, index) => {
              const role = interaction.guild?.roles.cache.get(roleId);

              if (!role)
                return `${index + 1}. 指定されたロールが存在しませんでした`;

              if (member.roles.cache.has(role.id)) {
                return `${index + 1}. ${role}を削除しました`;
              } else {
                return `${index + 1}. ${role}を付与しました`;
              }
            })
            .join('\n'),
          color: Colors.Blue,
          footer: footer(),
        },
      ],
      ephemeral: true,
    });

    interaction.message.edit({
      embeds: interaction.message.embeds,
      components: interaction.message.components,
    });
  }
});
