import { Event } from '../../lib/modules/Event';
import { client } from '../../index';
import { Events } from 'discord.js';

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  const member = newMember.guild.members.cache.get(newMember.id);
  if (!member) return;

  const zalgo_regex =
    /[\u0300-\u036f\u0483-\u0489\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe23]/
  
  if (newMember.nickname?.match(zalgo_regex)) {
    await member.setNickname(null, "The Zalgo text has been detected.");
  } else return;
});
