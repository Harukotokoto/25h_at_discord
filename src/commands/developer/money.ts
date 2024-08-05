import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { UUID } from '../../lib/modules/classes/UUID';
import { Economy } from '../../lib/modules/classes/Economy';
import { footer } from '../../lib/utils/embed';

export default new Command({
  name: 'money',
  description: '開発者専用',
  isOwnerCommand: true,
  options: [
    {
      name: 'add',
      description: '残高を追加します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: '追加する対象のユーザー',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: 'amount',
          description: '金額',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: 'add_to',
          description: '追加する場所',
          type: ApplicationCommandOptionType.String,
          required: false,
          choices: [
            { name: 'Wallet', value: 'wallet' },
            { name: 'Bank', value: 'bank' },
          ],
        },
      ],
    },
    {
      name: 'remove',
      description: '残高を削除します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: '削除する対象のユーザー',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: 'amount',
          description: '金額',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: 'remove_from',
          description: '削除する場所',
          type: ApplicationCommandOptionType.String,
          required: false,
          choices: [
            { name: 'Wallet', value: 'wallet' },
            { name: 'Bank', value: 'bank' },
          ],
        },
      ],
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const user = interaction.options.getUser('user', true);
      const uuid = new UUID(interaction.user.id);
      const economy = new Economy(await uuid.getUUID());

      const amount = interaction.options.getInteger('amount', true);

      switch (interaction.options.getSubcommand()) {
        case 'add':
          const addTo = interaction.options.getString('add_to');
          if (!addTo || addTo === 'bank') {
            await economy.addToBank(amount);

            await interaction.followUp({
              embeds: [
                {
                  description: `${user.tag}の口座残高に${amount}コインを追加しました`,
                  color: Colors.Purple,
                  footer: footer(),
                },
              ],
            });
          } else {
            await economy.addToWallet(amount);

            await interaction.followUp({
              embeds: [
                {
                  description: `${user.tag}の所持残高に${amount}コインを追加しました`,
                  color: Colors.Purple,
                  footer: footer(),
                },
              ],
            });
          }
          break;
        case 'remove':
          const remove_from = interaction.options.getString('remove_from');
          if (!remove_from || remove_from === 'bank') {
            await economy.removeFromBank(amount);

            await interaction.followUp({
              embeds: [
                {
                  description: `${user.tag}の口座残高から${amount}コインを徴収しました`,
                  color: Colors.Purple,
                  footer: footer(),
                },
              ],
            });
          } else {
            await economy.removeFromWallet(amount);

            await interaction.followUp({
              embeds: [
                {
                  description: `${user.tag}の所持残高から${amount}コインを徴収しました`,
                  color: Colors.Purple,
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
