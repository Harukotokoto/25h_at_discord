import { Event } from '../../lib/modules/Event';
import { Colors } from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (
    interaction.user.id !== '302050872383242240' ||
    interaction.commandName !== 'bump'
  )
    return;
  if (
    (await interaction.fetchReply()).embeds[0].description?.match(
      '表示順をアップしたよ'
    )
  ) {
    setTimeout(
      () => {
        interaction.channel?.send({
          embeds: [
            {
              title: 'Bumpの時間です！',
              description: '</bump:947088344167366698> で表示順位をあげよう！',
              color: Colors.Blue,
              footer: footer(),
            },
          ],
        });
      },
      2 * 60 * 60 * 1000
    );
  }
});
