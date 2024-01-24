import { Event } from '../../lib/modules/Event';
import { client } from '../../index';
import { ActivityType } from 'discord.js';

export default new Event('ready', () => {
  let index = 0;
  const status_list = [
    `たっくん鯖 | [takkun]人を捕食中`,
    `語るんです | [ktrnds]人を監視中`,
    `/help | Produced by Rena`,
  ];

  setInterval(() => {
    const takkun_guild = client.guilds.cache.get('1176812762110885908');
    if (!takkun_guild) return;

    const ktrnds_guild = client.guilds.cache.get('1176812762110885908');
    if (!ktrnds_guild) return;

    const takkun_memberCounter = takkun_guild.channels.cache.get(
      '1189473966297981030'
    );
    if (!takkun_memberCounter) return;

    const memberCount = {
      takkun: takkun_guild?.memberCount.toString() || (0).toString(),
      ktrnds: ktrnds_guild?.memberCount.toString() || (0).toString(),
    };

    takkun_memberCounter.setName(`メンバー数：${memberCount.takkun}`);

    if (index === status_list.length) index = 0;

    const status = status_list[index];

    client.user?.setActivity({
      name: status
        .replace('[takkun]', memberCount.takkun)
        .replace('[ktrnds]', memberCount.ktrnds),
      type: ActivityType.Custom,
    });

    index++;
  }, 10000);
});
