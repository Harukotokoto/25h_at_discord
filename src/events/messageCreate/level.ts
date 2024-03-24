import { Event } from '../../lib/modules/Event';
import { Leveling } from '../../lib/modules/classes/Leveling';

export default new Event('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return;
  const member = message.guild.members.cache.get(message.author.id);
  if (!member) return;

  const levelingManager = new Leveling(member);

  await levelingManager.addExperience();
});
