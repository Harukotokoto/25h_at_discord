import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, Colors } from 'discord.js';
import { exec, execSync } from 'child_process';
import { footer } from '../../lib/utils/Embed';

export default new Command({
  name: 'client',
  description: 'Botの機能を再読み込みします',
  isOwnerCommand: true,
  options: [
    {
      name: 'reload-event',
      description: 'イベントファイルをリロードします',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'restart',
      description: 'Botを再起動します',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'sync',
      description: 'Githubと同期して再起動します',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'stop',
      description: 'Botを停止します',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const cmd = interaction.options.getSubcommand();

      switch (cmd) {
        case 'event':
          await client.loadEvents();

          await interaction.followUp({
            embeds: [
              {
                title:
                  '<:check:1190622673999503390> イベントを再読み込みしました',
                color: Colors.Aqua,
                footer: footer(),
              },
            ],
          });
          break;
        case 'all':
          await interaction.followUp({
            embeds: [
              {
                title: '<:check:1190622673999503390> Botを再起動します',
                color: Colors.Purple,
                footer: footer(),
              },
            ],
          });

          exec('pm2 restart takkun');
          break;
        case 'sync':
          await interaction.followUp({
            embeds: [
              {
                title: 'GitHubの情報を取得しています',
                color: Colors.Purple,
                footer: footer(),
              },
            ],
          });

          execSync('git fetch');

          await interaction.editReply({
            embeds: [
              {
                title: 'GitHubのデータを同期しています',
                color: Colors.Purple,
                footer: footer(),
              },
            ],
          });

          execSync('git pull');

          await interaction.editReply({
            embeds: [
              {
                title: 'Botをビルドしています',
                color: Colors.Purple,
                footer: footer(),
              },
            ],
          });

          execSync('yarn build');

          await interaction.editReply({
            embeds: [
              {
                title: '同期が完了しました',
                description: 'Botを再起動します',
                color: Colors.Purple,
                footer: footer(),
              },
            ],
          });

          execSync('pm2 restart takkun');
          break;
        case 'stop':
          await interaction.followUp({
            embeds: [
              {
                title: 'Botを停止します',
                color: Colors.Red,
                footer: footer(),
              },
            ],
          });

          execSync('pm2 stop takkun');
          break;
      }
    },
    message: async ({ client, message, args }) => {
      if (
        !args[0] ||
        (args[0] !== 'event' &&
          args[0] !== 'all' &&
          args[0] !== 'sync' &&
          args[0] !== 'stop')
      )
        return message.reply({
          embeds: [
            {
              title: 'エラーが発生しました',
              description: '必要なパラメーターを指定してください',
              color: Colors.Red,
              footer: footer(),
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });

      if (args[0] === 'event') {
        await client.loadEvents();

        await message.reply({
          embeds: [
            {
              title: `✅ イベントを再読み込みしました`,
              color: Colors.Aqua,
              footer: footer(),
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });
      } else if (args[0] === 'all') {
        await message.reply({
          embeds: [
            {
              title: '✅ Botを再起動します',
              color: Colors.Purple,
              footer: footer(),
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });

        exec('pm2 restart takkun');
      } else if (args[0] === 'sync') {
        const msg_1 = await message.reply({
          embeds: [
            {
              title: '☑️ GitHubの情報を取得しています',
              color: Colors.Purple,
              footer: footer(),
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });

        execSync('git fetch');

        const msg_2 = await msg_1.edit({
          embeds: [
            {
              title: '☑️ GitHubのデータを同期しています',
              color: Colors.Purple,
              footer: footer(),
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });

        execSync('git pull');

        const msg_3 = await msg_2.edit({
          embeds: [
            {
              title: '☑️ Botをビルドしています',
              color: Colors.Purple,
              footer: footer(),
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });

        execSync('yarn build');

        await msg_3.edit({
          embeds: [
            {
              title: '✅ 同期が完了しました',
              description: 'Botを再起動します',
              color: Colors.Purple,
              footer: footer(),
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });

        execSync('pm2 restart takkun');
      } else if (args[0] === 'stop') {
        await message.reply({
          embeds: [
            {
              title: 'Botを停止します',
              color: Colors.Red,
              footer: footer(),
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });

        execSync('pm2 stop takkun');
      }
    },
  },
});
