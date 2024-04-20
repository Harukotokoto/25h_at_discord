import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType } from 'discord.js';

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
    interaction: ({ client, interaction }) => {},
  },
});
