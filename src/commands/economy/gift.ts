import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { UUID } from '../../lib/modules/classes/UUID';
import { Economy } from '../../lib/modules/classes/Economy';
import { CommandError } from '../../lib/modules/classes/CommandError';
import { Gift } from '../../lib/modules/classes/Gift';
import { footer } from '../../lib/utils/embed';

export default new Command({
  name: 'gift',
  description: 'ギフトに関するコマンド',
  options: [
    {
      name: 'create',
      description: 'ギフトを作成します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'amount',
          description: 'ギフトする金額',
          type: ApplicationCommandOptionType.Number,
          required: true,
        },
        {
          name: 'method',
          description: 'ギフトの受け取り方法',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
            { name: 'Direct', value: 'direct' },
            { name: 'Code', value: 'code' },
          ],
        },
        {
          name: 'user',
          description: 'ギフトを送信するユーザー',
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const user = interaction.options.getUser('user') || interaction.user;
      const uuid = new UUID(user.id);
      const economy = new Economy(await uuid.getUUID());

      const Error = new CommandError(interaction);

      switch (interaction.options.getSubcommand()) {
        case 'create':
          const giftManager = new Gift(await uuid.getUUID());
          const gift = await giftManager.create(
            interaction.options.getNumber('amount', true),
            interaction.options.getString('method', true),
            interaction.options.getUser('user')?.id
          );

          if (!gift.success) {
            return await Error.create(gift.message);
          }

          await interaction.followUp({
            embeds: [
              {
                description: gift.message,
                color: Colors.Green,
                footer: footer(),
              },
            ],
          });
      }
    },
  },
});
