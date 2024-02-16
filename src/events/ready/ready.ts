import { Event } from '../../lib/modules/Event';
import { client } from '../../index';
import { Colors, Events } from 'discord.js';
import axios from 'axios';
import { footer } from '../../lib/utils/Embed';

export default new Event('ready', async () => {
  client.Logger.info(`\x1b[32m${client.user?.tag} is now ready!\x1b[0m`);

  const channel = client.channels.cache.get('1207564642059157545');
  if (!channel || !channel.isTextBased()) return;

  const response = await axios.get('https://nekobot.xyz/api/image?type=hentai');
  const data = response.data.message;

  await channel.send({
    embeds: [
      {
        image: {
          url: data,
        },
        color: Colors.Orange,
        footer: footer(),
      },
    ],
  });

  setInterval(
    async () => {
      const channel = client.channels.cache.get('1207564642059157545');
      if (!channel || !channel.isTextBased()) return;

      const response = await axios.get(
        'https://nekobot.xyz/api/image?type=hentai'
      );
      const data = response.data.message;

      await channel.send({
        embeds: [
          {
            image: {
              url: data,
            },
            color: Colors.Orange,
            footer: footer(),
          },
        ],
      });
    },
    60 * 60 * 1000
  );
});
