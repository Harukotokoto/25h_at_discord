import { Event } from '../../lib/modules/Event';
import { Colors } from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (
    interaction.user.id !== '761562078095867916' ||
    interaction.commandName !== 'dissoku' ||
    interaction.options.getSubcommand() !== 'up'
  )
    return;
  if (
    (await interaction.fetchReply()).embeds[0].description?.match(
      'をアップしたよ!'
    )
  ) {
    setTimeout(
      () => {
        interaction.channel?.send({
          embeds: [
            {
              title: 'Upの時間です！',
              description: '</dissoku up:828002256690610256> で表示順位をあげよう！',
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
