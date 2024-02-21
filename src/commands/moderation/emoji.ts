import { Command } from '../../lib/modules/Command';
import { pingEmbed } from '../../lib/utils/Embed';

export default new Command({
  name: 'emoji',
  description: 'clone',
  requiredPermissions: ['Administrator'],
  ephemeral: false,
  execute: {
    interaction: async ({ client, interaction }) => {
      const oldServer = await client.guilds.fetch('1176812762110885908');
      if (!oldServer || !interaction.guild) return;

      await interaction.followUp({ content: 'コピーを開始します', ephemeral: true })
      const emojis = await oldServer.emojis.fetch();
      await interaction.editReply({ content: `${emojis.size}個の絵文字が見つかりました` });

      emojis.forEach(async (emoji) => {
        const newEmoji = await interaction.guild?.emojis.create({
          name: emoji.name as string,
          attachment: emoji.url,
        });

        await interaction.editReply({
          content: `${newEmoji}を追加しました`
        })
      })
    },
  },
});
