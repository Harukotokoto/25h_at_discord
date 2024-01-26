import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, ChannelType, Colors } from 'discord.js';
import { config_model } from '../../lib/models/config';
import { footer } from '../../lib/utils/Embed';

export default new Command({
  name: 'config',
  description: 'サーバーの設定を変更します',
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
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const cmd = interaction.options.getSubcommand();

      switch (cmd) {
        case 'report':
          const channel = interaction.options.getChannel('channel');
          if (!channel) {
            await config_model.findOneAndUpdate(
              {
                GuildID: interaction.guild?.id,
              },
              {
                Report: {
                  status: false,
                  LogChannel: undefined,
                },
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

          const config = await config_model.findOne({
            GuildID: interaction.guild?.id,
          });

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
                Report: {
                  status: true,
                  LogChannel: channel.id,
                },
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
      }
    },
  },
});
