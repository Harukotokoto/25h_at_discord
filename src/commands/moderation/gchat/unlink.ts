import { ExtendedClient } from '../../../lib/modules/ExtendedClient';
import {
  ChannelType,
  ChatInputCommandInteraction,
  Colors,
  WebhookClient,
} from 'discord.js';
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
    await interaction.editReply({
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
};
