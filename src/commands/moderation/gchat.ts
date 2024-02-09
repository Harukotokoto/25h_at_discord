import { Command } from '../../lib/modules/Command';
import { ApplicationCommandOptionType, ChannelType } from 'discord.js';
import link from './gchat/link';
import unlink from './gchat/unlink';
import { gchat_model } from '../../lib/models/gchat';

export default new Command({
  name: 'gchat',
  description: 'グローバルチャットに関するコマンド',
  requiredPermissions: ['Administrator'],
  options: [
    {
      name: 'link',
      description: 'グローバルチャットに登録します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'channel',
          description: 'グローバルチャットに登録するチャンネル',
          type: ApplicationCommandOptionType.Channel,
          channelTypes: [ChannelType.GuildText],
        },
      ],
    },
    {
      name: 'unlink',
      description: 'グローバルチャットとの連携を解除します',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'channel',
          description: 'グローバルチャットとの連携を解除するチャンネル',
          type: ApplicationCommandOptionType.String,
          autocomplete: true,
          required: true,
        },
      ],
    },
  ],
  execute: {
    autoComplete: async ({ client, interaction }) => {
      const option = interaction.options.getFocused(true);
      if (option.name === 'channel') {
        const data = await gchat_model.find({
          GuildID: interaction.guild?.id,
        });

        await interaction.respond(
          data.map((data) => {
            const channel = client.channels.cache.get(data.ChannelID);
            if (channel && channel?.type === ChannelType.GuildText) {
              return {
                name: channel.name,
                value: channel.id,
              };
            } else {
              return {
                name: '不明なチャンネル',
                value: data.ChannelID,
              };
            }
          })
        );
      }
    },
    interaction: async ({ client, interaction }) => {
      switch (interaction.options.getSubcommand()) {
        case 'link':
          await link({ client, interaction });
          break;
        case 'unlink':
          await unlink({ client, interaction });
          break;
      }
    },
  },
});
