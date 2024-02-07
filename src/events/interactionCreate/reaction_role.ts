import { Event } from '../../lib/modules/Event';
import { Colors } from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId === 'reaction_role') {
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    if (!member) return;

    const role = interaction.guild?.roles.cache.get(interaction.values[0]);
    if (!role) {
      return await interaction.reply({
        embeds: [
          {
            title: 'ロールの取得に失敗しました',
            description: '指定されたロールが存在しません',
            color: Colors.Red,
            footer: footer(),
          },
        ],
        ephemeral: true,
      });
    }

    if (!member.roles.cache.has(role.id)) {
      member.roles
        .add(role)
        .then(async () => {
          return await interaction.reply({
            embeds: [
              {
                description: `${role}を付与しました`,
                color: Colors.Green,
                footer: footer(),
              },
            ],
            ephemeral: true,
          });
        })
        .catch(async () => {
          return await interaction.reply({
            embeds: [
              {
                title: 'ロールの付与に失敗しました',
                description: '権限設定を確認してください',
                color: Colors.Red,
                footer: footer(),
              },
            ],
            ephemeral: true,
          });
        });
    } else {
      member.roles
        .remove(role)
        .then(async () => {
          return await interaction.reply({
            embeds: [
              {
                description: `${role}を削除しました`,
                color: Colors.Green,
                footer: footer(),
              },
            ],
            ephemeral: true,
          });
        })
        .catch(async () => {
          return await interaction.reply({
            embeds: [
              {
                title: 'ロールの削除に失敗しました',
                description: '権限設定を確認してください',
                color: Colors.Red,
                footer: footer(),
              },
            ],
            ephemeral: true,
          });
        });
    }

    await interaction.message.edit({
      embeds: interaction.message.embeds,
      components: interaction.message.components,
    });
  }
});
