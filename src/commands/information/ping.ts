import { Command } from '../../lib/modules/Command';
import { pingEmbed } from '../../lib/utils/Embed';

export default new Command({
  name: 'ping',
  description: 'Botの応答速度を表示します',
  ephemeral: false,
  execute: {
    interaction: async ({ interaction }) => {
      const response =
        Date.now() - (await interaction.fetchReply()).createdTimestamp;

      await interaction.followUp(await pingEmbed(response));
    },
    message: async ({ message }) => {
      const response = Date.now() - message.createdTimestamp;

      await message.reply(await pingEmbed(response));
    },
  },
});
