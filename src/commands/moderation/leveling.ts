import { Command } from '../../lib/modules/Command';
import {
  APIRole,
  ApplicationCommandOptionType,
  Colors,
  Role,
} from 'discord.js';
import { footer } from '../../lib/utils/embed';
import { Config } from '../../lib/modules/classes/Config';
import { CommandError } from '../../lib/modules/classes/CommandError';
import { level_model } from '../../lib/models/level_model';

export default new Command({
  name: 'leveling',
  description: 'レベリングに関する設定を行います',
  options: [
    {
      name: 'enable',
      description: 'レベリングを有効化します',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'disable',
      description: 'レベリングを無効化します',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      if (!interaction.guild) return;
      const config = new Config(interaction.guild.id);
      const Error = new CommandError(interaction);
      switch (interaction.options.getSubcommand()) {
        case 'enable':
          await config.setLeveling(true);

          await interaction.followUp({
            embeds: [
              {
                title: 'レベリングを有効化しました',
                color: Colors.Green,
                footer: footer(),
              },
            ],
          });
          break;
        case 'disable':
          await config.setLeveling(false);

          await interaction.followUp({
            embeds: [
              {
                title: 'レベリングを無効化しました',
                color: Colors.Red,
                footer: footer(),
              },
            ],
          });
          break;
      }
    },
  },
});
