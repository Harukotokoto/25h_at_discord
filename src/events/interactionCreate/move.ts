import { Event } from '../../lib/modules/Event';
import { client } from '../../index';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId === 'move') {
    const oldServer = client.guilds.cache.get('1176812762110885908');

    if (!oldServer || !interaction.guild) return;

    const oldMembers = await oldServer?.members.fetch();

    const oldMember = oldMembers.find(member => member.id === interaction.user.id);
    if (!oldMember) return console.log('oldMember not found');
    const newMember = interaction.guild.members.cache.get(interaction.user.id);
    if (!newMember) return console.log('newMember not found');

    oldMember?.roles.cache.forEach(async (oldRole) => {
      const newRole = interaction.guild?.roles.cache.find(
        (role) => role.name === oldRole.name
      );
      if (!newRole) return console.log(`Role ${oldRole.name} not found`);
      if (newMember?.roles.cache.has(newRole.id))
        return console.log(`Role ${oldRole.name} already exists`);
      if (newRole) await newMember?.roles.add(newRole);
    });

    await interaction.reply({
      content: 'ロールを移行しました',
      ephemeral: true,
    });
  }
});
