import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { CommandError } from '../../lib/modules/classes/CommandError';
import { footer } from '../../lib/utils/embed';

export default new Command({
  name: 'avatar',
  description: 'ユーザーのアバターを表示します',
  options: [
    {
      name: 'user',
      description: 'ユーザー',
      type: ApplicationCommandOptionType.User,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const user = interaction.options.getUser('user');
      const Error = new CommandError(interaction);
      if (!user) return Error.create('ユーザーが存在しません');

      const avatarURL = user.displayAvatarURL();

      await interaction.followUp({
        embeds: [
          {
            title: user.tag,
            image: {
              url: avatarURL,
            },
            color: Colors.Green,
            footer: footer(),
          },
        ],
      });
    },
  },
});
