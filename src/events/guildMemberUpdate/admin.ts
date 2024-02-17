import { Event } from '../../lib/modules/Event';
import { client } from '../../index';
import { Events } from 'discord.js';

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  const role = newMember.roles.cache.difference(oldMember.roles.cache).first();
  if (role?.id === '1208105713419817042') {
    setTimeout(async () => {
      try {
        await newMember.roles.remove('1208105713419817042');
        console.log(`あどみんろーるは ${newMember.user.tag} からさくじょされたよ`);
      } catch (error) {
        console.error(`えらーがでたよ ${error}`);
      }
    }, 20 * 60 * 1000);
  }
});
