import { Event } from '../../lib/modules/Event';
import { Colors } from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Event('messageCreate', async (message) => {
  if (message.author.id !== '302050872383242240') return;
  if (message.embeds[0].description?.match('をアップしたよ!')) {
    setTimeout(
      () => {
        message.channel.send({
          embeds: [
            {
              title: 'Upの時間です！',
              description:
                '</dissoku up:828002256690610256> で表示順位をあげよう！',
              color: Colors.Blue,
              footer: footer(),
            },
          ],
        });
      },
      60 * 60 * 1000
    );
  }
});
