import { Event } from '../../lib/modules/Event';
import { Colors } from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Event('messageUpdate', async (message) => {
  if (message.author?.id === '761562078095867916') {
    if (
      message.embeds[0]?.fields[0]?.name.match(/をアップしたよ/) ||
      message.embeds[0]?.fields[0]?.name.match(/I've bumped up/)
    ) {
      await message.channel.send({
        embeds: [
          {
            title: 'Upしてくれてありがとね！',
            description: '1時間後にお知らせするね！',
            color: Colors.Blue,
            footer: footer(),
          },
        ],
      });

      setTimeout(async () => {
        await message.channel.send({
          embeds: [
            {
              title: 'Upの時間です！',
              description:
                '</dissoku up:828002256690610256> で表示順位を上げよう！',
              color: Colors.Blue,
              footer: footer(),
            },
          ],
        });
      }, 60 * 60 * 1000);
    }
  }
});
