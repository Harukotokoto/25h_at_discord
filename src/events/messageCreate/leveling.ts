import { Event } from '../../lib/modules/Event';
import { Leveling } from '../../lib/modules/classes/Leveling';
import { leveling_model } from '../../lib/models/config';

export default new Event('messageCreate', async (message) => {
  if (!message.guild) return;

  const leveling = leveling_model.findOne({
    GuildID: message.guild.id,
  });

  if (!leveling) return;

  if (!message.guild || message.author.bot) return;
  const member = message.guild.members.cache.get(message.author.id);
  if (!member) return;

  const levelingManager = new Leveling(member);

  await levelingManager.addExperience();
});
