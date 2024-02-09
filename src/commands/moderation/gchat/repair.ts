import { ExtendedClient } from '../../../lib/modules/ExtendedClient';
import {
  ChannelType,
  ChatInputCommandInteraction,
  Colors,
  WebhookClient,
} from 'discord.js';
import { footer } from '../../../lib/utils/Embed';
import { gchat_model } from '../../../lib/models/gchat';

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
        title: '修復中...',
        color: Colors.Orange,
        footer: footer(),
      },
    ],
  });

  const data = await gchat_model.findOne({
    GuildID: interaction.guild?.id,
    ChannelID: interaction.options.getString('channel', true),
  });

  if (data) {
    const channel = client.channels.cache.get(
      interaction.options.getString('channel', true)
    );

    if (!channel || channel.type !== ChannelType.GuildText) {
      await gchat_model.deleteOne({
        GuildID: interaction.guild?.id,
        ChannelID: interaction.options.getString('channel', true),
      });

      return await interaction.editReply({
        embeds: [
          {
            title: '修復が完了しました',
            description: 'チャンネルが削除されていたため、連携を解除しました',
            color: Colors.Green,
            footer: footer(),
          },
        ],
      });
    } else {
      if (!data.Webhook) {
        const Webhook = await channel.createWebhook({
          name: 'たっくん鯖 Global',
        });

        await gchat_model.updateOne(
          {
            GuildID: interaction.guild?.id,
            ChannelID: channel.id,
          },
          {
            Webhook: {
              URL: Webhook.url,
              Token: Webhook.token,
              ID: Webhook.id,
            },
          }
        );

        return await interaction.editReply({
          embeds: [
            {
              title: '修復が完了しました',
              description:
                'Webhook情報が保存されていなかったため、Webhookを作成しました',
              color: Colors.Green,
              footer: footer(),
            },
          ],
        });
      } else {
        const hook = new WebhookClient({
          url: data.Webhook.URL,
        });

        try {
          await hook.send({
            embeds: [
              {
                title: 'デバッグメッセージ',
                description: '修復作業中のWebhookの存在確認メッセージです',
                color: Colors.Purple,
                footer: footer(),
              },
            ],
            allowedMentions: {
              parse: [],
            },
          });
        } catch (e) {
          const Webhook = await channel.createWebhook({
            name: 'たっくん鯖 Global',
          });

          await gchat_model.updateOne(
            {
              GuildID: interaction.guild?.id,
              ChannelID: channel.id,
            },
            {
              Webhook: {
                URL: Webhook.url,
                Token: Webhook.token,
                ID: Webhook.id,
              },
            }
          );

          return await interaction.editReply({
            embeds: [
              {
                title: '修復が完了しました',
                description:
                  'Webhookの送信に失敗したため、Webhookを再作成しました',
                color: Colors.Green,
                footer: footer(),
              },
            ],
          });
        }
      }
    }
  }

  await interaction.editReply({
    embeds: [
      {
        title: '修復が完了しました',
        description: '異常は見つかりませんでした',
        color: Colors.Green,
        footer: footer(),
      },
    ],
  });
};
