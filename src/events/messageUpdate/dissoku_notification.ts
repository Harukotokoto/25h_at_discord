import { Event } from '../../lib/modules/Event';
import { Colors } from 'discord.js';
import { footer } from '../../lib/utils/embed';
import ms from 'ms';
import { CoolTime } from '../../lib/modules/classes/CoolTime';
import { CommandError } from '../../lib/modules/classes/CommandError';
import { UUID } from '../../lib/modules/classes/UUID';
import { Economy } from '../../lib/modules/classes/Economy';

export default new Event('messageUpdate', async (message) => {
  if (message.author?.id === '761562078095867916') {
    if (
      message.embeds[0]?.fields[0]?.name.match(/をアップしたよ/) ||
      message.embeds[0]?.fields[0]?.name.match(/I've bumped up/)
    ) {
      if (!message.guild) return;
      const cooltime = new CoolTime(message.guild.id);

      const last_used = await cooltime.getCooltime('dissoku');

      if (last_used) {
        const now = new Date();
        const timeDifference = now.getTime() - last_used.getTime();
        const minutesDifference = timeDifference / (1000 * 60);

        if (minutesDifference < 5) return;
      }

      const uuid = new UUID(message.author.id);
      const economy = new Economy(await uuid.getUUID());

      await economy.addToWallet(1000);

      await cooltime.setCooltime(await uuid.getUUID(), 'work');

      await message.channel.send({
        embeds: [
          {
            title: 'Upしてくれてありがとね！',
            description: `2時間後にお知らせするね！\n-# Up報酬 +1000コイン`,
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
                '</dissoku up:828002256690610256>で表示順位を上げよう！\n-# Upすることでコインを獲得できます',
              color: Colors.Blue,
              footer: footer(),
            },
          ],
        });
      }, ms('1h'));
    }
  }
});
