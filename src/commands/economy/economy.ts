import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { UUID } from '../../lib/modules/classes/UUID';
import { Economy } from '../../lib/modules/classes/Economy';
import { footer } from '../../lib/utils/embed';

export default new Command({
  name: 'economy',
  description: 'お金に関するコマンド',
  options: [
    {
      name: 'balance',
      description: '残高を表示します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: '確認するユーザー',
          type: ApplicationCommandOptionType.User,
        },
      ],
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const user = interaction.options.getUser('user') || interaction.user;
      const uuid = new UUID(user.id);
      const economy = new Economy(await uuid.getUUID());

      switch (interaction.options.getSubcommand()) {
        case 'balance':
          await interaction.followUp({
            embeds: [
              {
                title: user.tag + 'の所持金',
                fields: [
                  {
                    name: '財布',
                    value: `${await economy.getWallet()}コイン`,
                    inline: true,
                  },
                  {
                    name: '銀行',
                    value: `${await economy.getBank()}コイン`,
                    inline: true,
                  },
                ],
                color: Colors.Aqua,
                footer: footer(),
              },
            ],
          });
          break;
      }
    },
  },
});
