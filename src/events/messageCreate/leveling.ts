import { Event } from '../../lib/modules/Event';
import { Leveling } from '../../lib/modules/classes/Leveling';
import { leveling_model } from '../../lib/models/config';

export default new Event('messageCreate', async (message) => {
  if (!message.guild) return;

  const leveling = await leveling_model.findOne({
    GuildID: message.guild.id,
  });

  if (leveling) {
    if (!message.guild || message.author.bot) return;
    const member = message.guild.members.cache.get(message.author.id);
    if (!member) return;

    const levelingManager = new Leveling(member);

    await levelingManager.addExperience();

    if (message.guild.id === '1125040058341261353') {
      const roles: {
        [key: number]: string;
      } = {
        10: '1214268663264448643',
        15: '1214268675855486997',
        20: '1214268668599341108',
        25: '1214268680209436752',
        30: '1214268672353378336',
        35: '1214268686022483988',
        40: '1214268683342577744',
        50: '1214268687041831013',
      };

      const level = (await levelingManager.getCurrentLevel())?.Level;
      if (!level) return;

      const updateRole = async (level: number) => {
        const roleId = roles[level];
        const role = message.guild?.roles.cache.get(roleId);
        if (!role) return;
        if (member.roles.cache.has(role.id)) return;
        await member.roles.add(role);
      };

      switch (level) {
        case 10:
          await updateRole(10);
          break;
        case 15:
          await updateRole(15);
          break;
        case 20:
          await updateRole(20);
          break;
        case 25:
          await updateRole(25);
          break;
        case 30:
          await updateRole(30);
          break;
        case 35:
          await updateRole(35);
          break;
        case 40:
          await updateRole(40);
          break;
        case 50:
          await updateRole(50);
          break;
      }
    }
  }
});
