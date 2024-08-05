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
    {
      name: 'leaderboard',
      description: 'リーダーボードを表示します',
      type: ApplicationCommandOptionType.Subcommand,
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
        case 'leaderboard':
          const leaderboard = await Economy.createLeaderboard(10);
          const formatted_leaderboard = await Promise.all(
            leaderboard.map(async (data) => {
              const user_id = await UUID.getUser(data.UUID);
              if (!user_id) return null;

              const user = client.users.cache.get(user_id);
              if (!user) return null;

              return `${user.displayName}(${user.tag}) - ${data.Wallet + data.Bank}コイン`;
            })
          );

          await interaction.followUp({
            embeds: [
              {
                title: 'コインの所持量ランキング',
                description: formatted_leaderboard
                  .filter((data) => data !== null)
                  .join('\n'),
              },
            ],
          });

          break;
      }
    },
  },
});
