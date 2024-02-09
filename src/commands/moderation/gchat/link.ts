import { ExtendedClient } from '../../../lib/modules/ExtendedClient';
import {
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  Colors,
  ComponentType,
  WebhookClient,
} from 'discord.js';
import { CommandError } from '../../../lib/utils/CommandError';
import { gchat_model } from '../../../lib/models/gchat';
import { footer } from '../../../lib/utils/Embed';

export default async ({
  client,
  interaction,
}: {
  client: ExtendedClient;
  interaction: ChatInputCommandInteraction;
}) => {
  await interaction.followUp({
    embeds: [
      {
        title: '接続中...',
        color: Colors.Gold,
        footer: footer(),
      },
    ],
  });

  const channel =
    interaction.options.getChannel('channel', false, [ChannelType.GuildText]) ||
    interaction.channel;

  const Error = new CommandError(interaction);

  if (!channel || !interaction.guild || channel.type !== ChannelType.GuildText)
    return;

  const data = await gchat_model.findOne({
    GuildID: interaction.guild.id,
    ChannelID: channel.id,
  });

  if (data) {
    return await Error.edit(
      `既に登録しています。</gchat unlink:1205443761744912437>で連携を解除できます。`
    );
  }

  const Webhook = await channel.createWebhook({
    name: 'たっくん鯖 Global',
  });

  await gchat_model.create({
    GuildID: interaction.guild.id,
    ChannelID: channel.id,
    Webhook: {
      URL: Webhook.url,
      Token: Webhook.token,
      ID: Webhook.id,
    },
  });

  await interaction.editReply({
    embeds: [
      {
        title: `登録しました`,
        description:
          `${channel}をたっくん鯖グローバルに接続しました\n` +
          'ルールを厳守してご利用ください\n' +
          '連携を解除したい場合は</gchat unlink:1205443761744912437>を使用してください。\n' +
          'Wick等のAnti Raid Botが導入されている場合、スパムと誤認されWebhookが削除され、連携が自動的に解除される場合があります。\n' +
          'Wickの場合は、`w!heat ?off 6`コマンドを使用してWebhookの監視を無効化してください',
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

  if (!interaction.guild) return;

  const members = await interaction.guild.members.fetch();

  const global_chats = await gchat_model.find();
  global_chats.forEach((data) => {
    if (!data || !data.Webhook) {
      return gchat_model.deleteOne({
        GuildID: data.GuildID,
        ChannelID: data.ChannelID,
      });
    }

    if (data.ChannelID === channel?.id) return;

    const target_channel = client.channels.cache.get(data.ChannelID);
    if (!target_channel) {
      return gchat_model.deleteOne({
        GuildID: data.GuildID,
        ChannelID: data.ChannelID,
      });
    }

    const hook = new WebhookClient({
      url: data.Webhook.URL,
    });

    try {
      if (!interaction.guild) return;
      hook.send({
        embeds: [
          {
            title: `新規サーバーが参加しました！`,
            description:
              `${interaction.guild.name}がグローバルチャットに参加しました\n` +
              `サーバーID: ${interaction.guild.id}\n` +
              `人数: ${members.size}人`,
            author: {
              name: interaction.guild.name,
              icon_url: interaction.guild.iconURL() ?? '',
            },
          },
        ],
      });
    } catch (e) {
      return e;
    }
  });

  const target_channel = client.channels.cache.get('1205163605247393833');
  if (!target_channel || !target_channel.isTextBased()) return;

  const invite = await channel.createInvite({
    maxAge: 0,
  });

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
};
