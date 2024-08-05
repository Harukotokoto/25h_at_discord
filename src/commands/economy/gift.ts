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
  ephemeral: true,
  options: [
    {
      name: 'create',
      description: 'ギフトを作成します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'amount',
          description: 'ギフトする金額',
          type: ApplicationCommandOptionType.Integer,
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
    {
      name: 'use',
      description: 'ギフトコードを使用します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'code',
          description: 'ギフトコード',
          type: ApplicationCommandOptionType.String,
          required: true,
          minLength: 8,
        },
      ],
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const user = interaction.user;
      const uuid = new UUID(user.id);

      const Error = new CommandError(interaction);

      const giftManager = new Gift(await uuid.getUUID());

      switch (interaction.options.getSubcommand()) {
        case 'create':
          if (
            interaction.options.getUser('user') &&
            interaction.options.getUser('user')?.bot
          ) {
            await Error.create('Botにギフトすることはできません');
          }

          const create_gift = await giftManager.create(
            interaction.options.getInteger('amount', true),
            interaction.options.getString('method', true),
            interaction.options.getUser('user')?.id
          );

          if (!create_gift.success) {
            return await Error.create(create_gift.message);
          }

          await interaction.followUp({
            embeds: [
              {
                description: create_gift.message,
                color: Colors.Green,
                footer: footer(),
              },
            ],
          });
          break;
        case 'use':
          const use_gift = await giftManager.use(
            interaction.options.getString('code', true)
          );

          if (!use_gift.success) {
            return await Error.create(use_gift.message);
          }

          await interaction.followUp({
            embeds: [
              {
                description: use_gift.message,
                color: Colors.Gold,
                footer: footer(),
              },
            ],
          });
          break;
      }
    },
  },
});
