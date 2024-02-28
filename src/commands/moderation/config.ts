import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, ChannelType, Colors } from 'discord.js';
import { footer } from '../../lib/utils/embed';

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
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const config_model = client.models.config;

      const cmd = interaction.options.getSubcommand();
      const channel = interaction.options.getChannel('channel');
      const config = await config_model.findOne({
        GuildID: interaction.guild?.id,
      });

      switch (cmd) {
        case 'report':
          if (!channel) {
            await config_model.findOneAndUpdate(
              {
                GuildID: interaction.guild?.id,
              },
              {
                'Report.status': false,
                'Report.LogChannel': undefined,
              }
            );

            return await interaction.followUp({
              embeds: [
                {
                  title: `通報機能を無効化しました`,
                  color: Colors.Aqua,
                  footer: footer(),
                },
              ],
            });
          }

          if (!config) {
            await config_model.create({
              GuildID: interaction.guild?.id,
              Report: {
                status: true,
                LogChannel: channel.id,
              },
            });
          }

          if (config) {
            await config_model.findOneAndUpdate(
              {
                GuildID: interaction.guild?.id,
              },
              {
                'Report.status': true,
                'Report.LogChannel': channel.id,
              }
            );
          }

          await interaction.followUp({
            embeds: [
              {
                title: '通報機能を有効化しました',
                description: `通報されたメッセージは${channel}に送信されます`,
                color: Colors.Green,
                footer: footer(),
              },
            ],
          });
          break;
        case 'publish':
          if (!channel) {
            await config_model.findOneAndUpdate(
              {
                GuildID: interaction.guild?.id,
              },
              {
                'Publish.status': false,
                'Publish.ChannelID': undefined,
              }
            );

            return await interaction.followUp({
              embeds: [
                {
                  title: `自動公開機能を無効化しました`,
                  color: Colors.Aqua,
                  footer: footer(),
                },
              ],
            });
          }

          if (!config) {
            await config_model.create({
              GuildID: interaction.guild?.id,
              'Publish.status': true,
              'Publish.ChannelID': channel.id,
            });
          }

          if (config) {
            await config_model.findOneAndUpdate(
              {
                GuildID: interaction.guild?.id,
              },
              {
                'Publish.status': true,
                'Publish.ChannelID': channel.id,
              }
            );
          }

          await interaction.followUp({
            embeds: [
              {
                title: '自動公開機能を有効化しました',
                description:
                  `${channel}に送信されたメッセージは自動的に公開されます\n` +
                  '※Botのメッセージは公開されません',
                color: Colors.Green,
                footer: footer(),
              },
            ],
          });
          break;
      }
    },
  },
});
