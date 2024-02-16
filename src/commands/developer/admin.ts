import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { codeBlock } from '@discordjs/builders';
import { footer } from '../../lib/utils/Embed';
import { CommandError } from '../../lib/utils/CommandError';

export default new Command({
  name: 'admin',
  description: '管理者権限を切り替えます',
  private: true,
  ephemeral: true,
  execute: {
    interaction: async ({ interaction, client }) => {
      if (!interaction.guild) return;
      const admins = [
        '1176812229631430660',
        '1004365048887660655',
        '1047017417093685279',
      ];

      const Error = new CommandError(interaction);

      if (!admins.includes(interaction.user.id)) {
        return await Error.create('このコマンドは開発者のみ実行可能です');
      }

      const member = interaction.guild.members.cache.get(interaction.user.id);
      if (!member) return await Error.create('メンバーが見つかりませんでした');

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
    },
  },
});
