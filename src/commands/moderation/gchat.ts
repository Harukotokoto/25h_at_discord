import { Command } from '../../lib/modules/Command';
import {
  ApplicationCommandOptionType,
  ButtonStyle,
  ChannelType,
  Colors,
  ComponentType,
} from 'discord.js';
import { gchat_model } from '../../lib/models/gchat';
import { footer } from '../../lib/utils/Embed';
import { CommandError } from '../../lib/utils/CommandError';

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
  ],
  execute: {
    interaction: async ({ client, interaction }) => {
      const channel =
        interaction.options.getChannel('channel', false, [
          ChannelType.GuildText,
        ]) || interaction.channel;

      const Error = new CommandError(interaction);

      if (
        !channel ||
        !interaction.guild ||
        channel.type !== ChannelType.GuildText
      )
        return;

      const data = await gchat_model.findOne({
        GuildID: interaction.guild.id,
        ChannelID: channel.id,
      });

      if (data) {
        return await Error.create(
          `既に登録しています。/gchat unlinkで連携を解除できます。`
        );
      }

      await gchat_model.create({
        GuildID: interaction.guild.id,
        ChannelID: channel.id,
      });

      await interaction.followUp({
        embeds: [
          {
            title: `登録しました`,
            description: `${channel}をたっくん鯖グローバルに接続しました\nルールを厳守してご利用ください。`,
            color: Colors.Blue,
            footer: footer(),
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: 'たっくん鯖',
                style: ButtonStyle.Link,
                url: 'https://discord.gg/dWK6cxsmBH',
              },
              {
                type: ComponentType.Button,
                label: 'サービス利用規約',
                style: ButtonStyle.Link,
                url: 'https://discord.com/channels/1176812762110885908/1176819197477670982/1193912652582375535',
              },
            ],
          },
        ],
      });

      const target_channel = client.channels.cache.get('1205163605247393833');
      if (!target_channel || !target_channel.isTextBased()) return;

      const invite = await channel.createInvite({
        maxAge: 0,
      });

      const members = await interaction.guild.members.fetch();

      await target_channel.send({
        embeds: [
          {
            title: `新規サーバーをグローバルチャットに登録しました`,
            fields: [
              {
                name: 'サーバー名',
                value: interaction.guild.name,
                inline: true,
              },
              {
                name: 'サーバーID',
                value: interaction.guild.id,
                inline: true,
              },
              {
                name: 'サーバー人数',
                value: members.size.toString() + '人',
                inline: true,
              },
              {
                name: 'サーバー所有者',
                value: `<@!${(await interaction.guild.fetchOwner()).user.id}>`,
                inline: true,
              },
            ],
            author: {
              name: interaction.guild.name,
              icon_url: interaction.guild.iconURL() ?? '',
            },
            color: Colors.Blue,
            footer: footer(),
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: 'チャンネル招待リンク',
                style: ButtonStyle.Link,
                url: invite.url,
              },
            ],
          },
        ],
      });
    },
  },
});
