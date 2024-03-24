import { Event } from '../../lib/modules/Event';
import { client } from '../../index';
import { Colors } from 'discord.js';
import { footer } from '../../lib/utils/embed';

export default new Event('messageUpdate', async (oldMessage, newMessage) => {
  if (newMessage?.author?.id === '761562078095867916') {
    const channel = client.channels.cache.get(newMessage.channel.id);
    if (!channel || !channel.isTextBased()) return;

    const msg = await channel.messages.fetch(newMessage.id);
    const oldMsg = await channel.messages.fetch(oldMessage.id);

    if (oldMsg.embeds[0].fields[0].name === msg.embeds[0].fields[0].name)
      return;

    if (
      msg.embeds[0].fields[0].name.match(/をアップしたよ!/) ||
      msg.embeds[0].fields[0].name.match(/I've bumped up/)
    ) {
      await channel.send({
        embeds: [
          {
            title: 'Upしてくれてありがとね！',
            description: '1時間後にお知らせするね！',
            color: Colors.Blue,
            footer: footer(),
          },
        ],
      });

      setTimeout(
        async () => {
          await channel.send({
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
        },
        60 * 60 * 1000
      );
    }
  }
});
