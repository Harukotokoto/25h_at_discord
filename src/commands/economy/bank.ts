import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { UUID } from '../../lib/modules/classes/UUID';
import { Economy } from '../../lib/modules/classes/Economy';
import { CommandError } from '../../lib/modules/classes/CommandError';
import { footer } from '../../lib/utils/embed';

export default new Command({
  name: 'bank',
  description: '銀行を管理します',
  options: [
    {
      name: 'deposit',
      description: '銀行に預金します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'amount',
          description: '入金する金額',
          type: ApplicationCommandOptionType.Number,
          required: true,
        },
      ],
    },
    {
      name: 'withdraw',
      description: '銀行から引き出します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'amount',
          description: '出金する金額',
          type: ApplicationCommandOptionType.Number,
          required: true,
        },
      ],
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const uuid = new UUID(interaction.user.id);
      const economy = new Economy(await uuid.getUUID());

      const Error = new CommandError(interaction);

      const wallet = await economy.getWallet();

      switch (interaction.options.getSubcommand()) {
        case 'deposit':
          const dep_amount = interaction.options.getNumber('amount', true);
          if (wallet < dep_amount) {
            return await Error.create('所持残高を上回る金額を指定することはできません');
          }

          await economy.removeFromWallet(dep_amount);
          await economy.addToBank(dep_amount);

          await interaction.followUp({
            embeds: [
              {
                title: '銀行口座に入金しました',
                description: `口座残高: ${await economy.getBank()}コイン`,
                color: Colors.Green,
                footer: footer(),
              },
            ],
          });

          break;
        case 'withdraw':
          const with_amount = interaction.options.getNumber('amount', true);
          if (wallet < with_amount) {
            return await Error.create(
              '口座残高を上回る金額を指定することはできません'
            );
          }

          await economy.addToWallet(with_amount);
          await economy.removeFromBank(with_amount);

          await interaction.followUp({
            embeds: [
              {
                title: '銀行口座から出金しましたしました',
                description: `口座残高: ${await economy.getBank()}コイン`,
                color: Colors.Green,
                footer: footer(),
              },
            ],
          });
      }
    },
  },
});
