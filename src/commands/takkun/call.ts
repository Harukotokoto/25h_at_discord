import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { codeBlock } from '@discordjs/builders';
import { footer } from '../../lib/utils/Embed';

export default new Command({
  name: 'call',
  description: '運営を呼び出します',
  private: true,
  options: [
    {
      name: 'reason',
      description: 'Reason to call',
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: {
    interaction: async ({ interaction, client }) => {
      const reason = interaction.options.getString('reason') || '';
      await interaction.followUp({
        embeds: [
          {
            title: 'お呼び出しですわよ!!',
            description:
              '理由\n' +
              codeBlock(reason) +
              `\nBy ${interaction.user.displayName}(${interaction.user.tag})`,
            color: Colors.Gold,
            footer: footer(),
          },
        ],
      });
      await interaction.channel?.send(`<@&1176816017905811526>`);
    },
  },
});
