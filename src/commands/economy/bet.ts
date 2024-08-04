import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { Economy } from '../../lib/modules/classes/Economy';
import { UUID } from '../../lib/modules/classes/UUID';
import { random } from '../../lib/utils/random';
import { CommandError } from '../../lib/modules/classes/CommandError';
import { footer } from '../../lib/utils/embed';

export default new Command({
  name: 'bet',
  description: '賭けでコインを稼ぎます',
  options: [
    {
      name: 'guess',
      description:
        '1~3の数字を予想し、的中するとコインがもらえます。外れると賭けた分没収されます',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'amount',
          description: '賭ける金額',
          type: ApplicationCommandOptionType.Number,
          required: true,
        },
        {
          name: 'prediction',
          description: '予想',
          type: ApplicationCommandOptionType.Number,
          choices: [
            { name: '1', value: 1 },
            { name: '2', value: 2 },
            { name: '3', value: 3 },
          ],
          required: true,
        },
      ],
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      if (!interaction.guild) return;
      const uuid = new UUID(interaction.user.id);
      const economy = new Economy(await uuid.getUUID());

      const Error = new CommandError(interaction);

      switch (interaction.options.getSubcommand()) {
        case 'guess':
          const wallet = await economy.getWallet();

          const bet = interaction.options.getNumber('amount', true);
          const prediction = interaction.options.getNumber('prediction', true);
          const answer = random([1, 2, 3]);

          if (bet < 50) {
            return Error.create('賭ける金額は50コイン以上である必要があります');
          }

          if (bet > wallet) {
            return Error.create('現在の残高を上回るベットはできません');
          }

          await economy.removeFromWallet(bet);

          if (prediction === answer) {
            const multiplier = random([1.5, 1.5, 1.5, 2, 2, 2.5, 3 ])
            await economy.addToWallet(Math.round(bet * multiplier));

            await interaction.followUp({
              embeds: [
                {
                  title: '勝利',
                  description: `+${Math.round(bet * multiplier)}コイン\n\n残高: ${await economy.getWallet()}コイン`,
                  color: Colors.Green,
                  footer: footer(),
                },
              ],
            });
          } else {
            await interaction.followUp({
              embeds: [
                {
                  title: '敗北',
                  description: `あなたの数字: ${prediction}\nディーラーの数字${answer}\n-${bet}コイン\n\n残高: ${await economy.getWallet()}コイン`,
                  color: Colors.Grey,
                  footer: footer(),
                },
              ],
            });
          }

          break;
      }
    },
  },
});
