import { Event } from '../../lib/modules/Event';
import { client } from '../../index';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === "move") {
    const oldServer = client.guilds.cache.get('1176812762110885908');
  const newServer = client.guilds.cache.get('1209731058266808360');

  if (!oldServer || !newServer) return;

  const oldMember = oldServer.members.cache.get(interaction.user.id);
  const newMember = newServer.members.cache.get(interaction.user.id);

  oldMember?.roles.cache.forEach((oldRole) => {
    const newRole = newServer.roles.cache.find(role => role.name === oldRole.name);
    if (!newRole) return;
    if (newMember?.roles.cache.has(newRole.id)) return;
    if (newRole) newMember?.roles.add(newRole);
  })

  interaction.reply({
    content: 'ロールを移行しました',
    ephemeral: true,
  })
  }
});