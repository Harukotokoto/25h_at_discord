import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, ChannelType, Colors } from 'discord.js';
import { footer } from '../../lib/utils/embed';
import { Config } from '../../lib/modules/classes/Config';

export default new Command({
  name: 'config',
  description: 'サーバーの設定を変更します',
  requiredPermissions: ['ManageGuild'],
  options: [
    {
      name: 'report',
      description: '通報機能のON,OFFを設定します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'channel',
          description: '通報のログを出力するチャンネル',
          type: ApplicationCommandOptionType.Channel,
          channel_types: [ChannelType.GuildText],
        },
      ],
    },
    {
      name: 'publish',
      description: 'お知らせのメッセージを自動で公開します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'channel',
          description: '自動公開するチャンネル',
          type: ApplicationCommandOptionType.Channel,
          channel_types: [ChannelType.GuildAnnouncement],
        },
      ],
    },
    {
      name: 'leveling',
      description: 'レベリング機能の有無を切り替えます',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'state',
          description: 'レベリングの有無(デフォルト:OFF)',
          type: ApplicationCommandOptionType.Boolean,
          required: true,
        },
      ],
    },
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      if (!interaction.guild) return;
      const cmd = interaction.options.getSubcommand();
      const config = new Config(interaction.guild?.id);

      switch (cmd) {
        case 'leveling':
          const state = interaction.options.getBoolean('state') ?? false;
          await config.setLeveling(state);

          await interaction.followUp({
            embeds: [
              {
                title: state
                  ? 'レベリングを有効化しました'
                  : 'レベリングを無効化しました',
                color: state ? Colors.Green : Colors.Red,
                footer: footer(),
              },
            ],
          });

          break;
        case 'report':
          const report_channel = interaction.options.getChannel('channel');
          if (!report_channel) {
            await config.setReport();

            await interaction.followUp({
              embeds: [
                {
                  title: `通報機能を無効化しました`,
                  color: Colors.Red,
                  footer: footer(),
                },
              ],
            });
          } else {
            await config.setReport(report_channel.id);

            await interaction.followUp({
              embeds: [
                {
                  title: '通報機能を有効化しました',
                  description: `通報されたメッセージは${report_channel}に送信されます`,
                  color: Colors.Green,
                  footer: footer(),
                },
              ],
            });
          }
          break;
        case 'publish':
          const publish_channel = interaction.options.getChannel('channel');
          if (!publish_channel) {
            await config.setPublish();

            await interaction.followUp({
              embeds: [
                {
                  title: `自動公開機能を無効化しました`,
                  color: Colors.Red,
                  footer: footer(),
                },
              ],
            });
          } else {
            await config.setPublish(publish_channel.id);

            await interaction.followUp({
              embeds: [
                {
                  title: '自動公開機能を有効化しました',
                  description:
                    `${publish_channel}に送信されたメッセージは自動的に公開されます\n` +
                    '※Botのメッセージは公開されません',
                  color: Colors.Green,
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
