import { Event } from '../../lib/modules/Event';
import {
  ButtonStyle,
  ChannelType,
  Colors,
  ComponentType,
  TextInputStyle,
} from 'discord.js';
import { client } from '../../index';
import { footer } from '../../lib/utils/Embed';

export default new Event('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'feedback-send') {
      interaction.showModal({
        title: 'フィードバックを送信',
        customId: 'feedback-content',
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.TextInput,
                style: TextInputStyle.Paragraph,
                label: '内容を入力',
                placeholder:
                  '〇〇コマンドを追加してほしい、〇〇が使いにくい等...',
                customId: 'feedback-description',
                required: true,
              },
            ],
          },
        ],
      });
    }

    if (interaction.customId === 'feedback-accept') {
      const channel = client.channels.cache.get('1199654282195128401');
      if (!channel || channel.type !== ChannelType.GuildText) return;

      channel.send({
        embeds: [
          {
            title: '✅ 受諾済みのフィードバック',
            description: `[詳細を確認](${interaction.message.url})`,
            color: Colors.Aqua,
            footer: footer(),
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                customId: 'feedback-accept',
                label: 'フィードバックを受諾',
                style: ButtonStyle.Success,
                emoji: '✅',
              },
            ],
          },
        ],
      });
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'feedback-content') {
      await interaction.reply({
        embeds: [
          {
            title: '📩 フィードバックを送信しました！',
            description:
              'Botの改善にご協力いただきありがとうございます！' +
              '\n' +
              '貴重な意見をありがとうございました！',
          },
        ],
        ephemeral: true,
      });

      const channel = client.channels.cache.get('1199648104924844162');
      if (!channel || channel.type !== ChannelType.GuildText) return;

      channel.send({
        content: '<@&1193603575608254616>',
        embeds: [
          {
            title: '📩 フィードバックを受け取りました',
            fields: [
              {
                name: '送信者:',
                value: `<@!${interaction.user.id}>`,
              },
              {
                name: '内容:',
                value: interaction.fields.getField('feedback-description')
                  .value,
              },
            ],
            color: Colors.Aqua,
            footer: footer(),
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                customId: 'feedback-accept',
                label: 'フィードバックを受諾',
                style: ButtonStyle.Success,
                emoji: '✅',
              },
            ],
          },
        ],
      });
    }
  }
});
