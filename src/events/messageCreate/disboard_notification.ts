import { Event } from '../../lib/modules/Event';
import { Colors } from 'discord.js';
import { footer } from '../../lib/utils/embed';
import ms from 'ms';
import { UUID } from '../../lib/modules/classes/UUID';
import { Economy } from '../../lib/modules/classes/Economy';

export default new Event('messageCreate', async (message) => {
  if (message.author.id === '302050872383242240') {
    if (
      message.embeds[0]?.description?.match(/表示順をアップしたよ/) ||
      message.embeds[0]?.description?.match(/Bump done/)
    ) {
      await message.channel.send({
        embeds: [
          {
            title: 'Bumpしてくれてありがとね！',
            description: `2時間後にお知らせするね！`,
            color: Colors.Blue,
            footer: footer(),
          },
        ],
      });

      setTimeout(async () => {
        await message.channel.send({
          embeds: [
            {
              title: 'Bumpの時間です！',
              description: '</bump:947088344167366698>で表示順位を上げよう！\n',
              color: Colors.Blue,
              footer: footer(),
            },
          ],
        });
      }, ms('2h'));
    }
  }
});
