import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { codeBlock } from '@discordjs/builders';
import { footer } from '../../lib/utils/Embed';
import { CommandError } from '../../lib/utils/CommandError';
import { admin_model } from '../../lib/models/admins';

export default new Command({
  name: 'admin',
  description: '管理者権限を切り替えます',
  ephemeral: true,
  options: [
    {
      name: 'add',
      description: '実行可能ユーザーを追加します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: '追加するユーザー',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: 'remove',
      description: '実行可能ユーザーを削除します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: '削除するユーザー',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: 'list',
      description: '実行可能ユーザーを表示します',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'toggle',
      description: '管理者権限を切り替えます',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  private: true,
  execute: {
    interaction: async ({ interaction, client }) => {
      if (!interaction.guild) return;
      const administrators = ['1176812229631430660', '1004365048887660655'];

      const Error = new CommandError(interaction);

      switch (interaction.options.getSubcommand()) {
        case 'add':
          if (!administrators.includes(interaction.user.id)) {
            return await Error.create('このコマンドは開発者のみ実行可能です');
          }

          const add_user = interaction.options.getUser('user', true);

          if (await admin_model.findOne({ UserID: add_user.id })) {
            return await Error.create(
              'このユーザーは既に管理者に登録されています'
            );
          }

          await admin_model.create({ UserID: add_user.id });

          await interaction.followUp({
            embeds: [
              {
                description: `${add_user}を管理者に追加しました`,
                color: Colors.Green,
                footer: footer(),
              },
            ],
          });
          break;
        case 'remove':
          if (!administrators.includes(interaction.user.id)) {
            return await Error.create('このコマンドは開発者のみ実行可能です');
          }

          const remove_user = interaction.options.getUser('user', true);

          if (!(await admin_model.findOne({ UserID: remove_user.id }))) {
            return await Error.create(
              'このユーザーは管理者に登録されていません'
            );
          }

          await admin_model.deleteOne({ UserID: remove_user.id });

          await interaction.followUp({
            embeds: [
              {
                description: `${remove_user}を管理者から削除しました`,
                color: Colors.Red,
                footer: footer(),
              },
            ],
          });
          break;
        case 'list':
          const admins = await admin_model.find();
          const members = admins.map((data) => {
            const user = client.users.cache.get(data.UserID);
            if (!user) return;
            return user;
          });

          await interaction.followUp({
            embeds: [
              {
                title: '管理者一覧',
                description: members
                  .map((member) => member?.toString())
                  .join('\n'),
                color: Colors.Blue,
                footer: footer(),
              },
            ],
          });
          break;
        case 'toggle':
          const admin = await admin_model.findOne({
            UserID: interaction.user.id,
          });

          if (!admin) {
            return await Error.create(
              'このコマンドは許可されたユーザーのみ実行可能です'
            );
          }

          const member = interaction.guild.members.cache.get(
            interaction.user.id
          );
          if (!member)
            return await Error.create('メンバーが見つかりませんでした');

          if (member.roles.cache.has('1208105713419817042')) {
            member.roles.remove('1208105713419817042').then(async () => {
              interaction.followUp({
                embeds: [
                  {
                    description: `${member}から管理者権限を剥奪しました`,
                    color: Colors.Green,
                    footer: footer(),
                  },
                ],
              });
            });
          } else {
            member.roles.add('1208105713419817042').then(async () => {
              interaction.followUp({
                embeds: [
                  {
                    description: `${member}に管理者権限を付与しました`,
                    color: Colors.Green,
                    footer: footer(),
                  },
                ],
              });
            });
          }
          break;
      }
    },
  },
});
