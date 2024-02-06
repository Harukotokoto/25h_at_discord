import { Event } from '../../lib/modules/Event';
import { Colors } from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Event('messageUpdate', async (oldMessage, newMessage) => {
  if (newMessage.author?.id !== '761562078095867916') return;
  if (newMessage.embeds[0].description?.match('をアップしたよ!')) {
    setTimeout(
      () => {
        newMessage.channel?.send({
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
      2 * 60 * 60 * 1000
    );
  }
});
