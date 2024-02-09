import { ExtendedClient } from '../../../lib/modules/ExtendedClient';
import {
  AttachmentBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  Colors,
  ComponentType,
  WebhookClient,
} from 'discord.js';
import { gchat_model } from '../../../lib/models/gchat';
import { footer } from '../../../lib/utils/Embed';
import { client } from '../../../index';
import { messages_model } from '../../../lib/models/messages';

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
        title: '解除中...',
        color: Colors.Gold,
        footer: footer(),
      },
    ],
  });

  const channel_id = interaction.options.getString('channel', true);

  const data = await gchat_model.findOne({
    GuildID: interaction.guild?.id,
    ChannelID: channel_id,
  });

  if (!data) {
    return await interaction.editReply({
      embeds: [
        {
          title: '解除に失敗しました',
          description: '指定されたチャンネルは登録されていません',
          color: Colors.Red,
          footer: footer(),
        },
      ],
    });
  }

  const channel = client.channels.cache.get(channel_id);

  if (
    data &&
    data.Webhook &&
    channel &&
    channel.type === ChannelType.GuildText
  ) {
    const Webhook = new WebhookClient({
      url: data.Webhook.URL,
    });

    await Webhook.delete();
  }

  await gchat_model.findOneAndDelete({
    GuildID: interaction.guild?.id,
    ChannelID: channel_id,
  });

  await interaction.editReply({
    embeds: [
      {
        title: '連携を解除しました',
        description:
          'グローバルチャットとの連携を解除しました。\nもう一度登録する場合は</gchat link:1205443761744912437>コマンドを使用してください',
        color: Colors.Blue,
        footer: footer(),
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

    if (data.ChannelID === channel_id) return;

    const channel = client.channels.cache.get(data.ChannelID);
    if (!channel) {
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
            title: `サーバーが退出しました`,
            description: `${interaction.guild.name}がグローバルチャットから切断しました`,
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

  await target_channel.send({
    embeds: [
      {
        title: `グローバルチャットの連携を解除しました`,
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
        ],
        author: {
          name: interaction.guild.name,
          icon_url: interaction.guild.iconURL() ?? '',
        },
        color: Colors.Blue,
        footer: footer(),
      },
    ],
  });
};
