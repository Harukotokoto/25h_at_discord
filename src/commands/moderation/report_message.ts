import { Command } from '../../lib/modules/Command';
import {
  ApplicationCommandType,
  ButtonStyle,
  ChannelType,
  Colors,
  ComponentType,
} from 'discord.js';
import { footer } from '../../lib/utils/embed';
import { Member, Space } from '../../lib/utils/emojis';
import { report_model } from '../../lib/models/config';

export default new Command({
  name: 'メッセージを通報',
  type: ApplicationCommandType.Message,
  ephemeral: true,
  execute: {
    interaction: async ({ client, interaction }) => {
      const message = interaction.targetMessage;
      const member = interaction.targetMessage.member;

      if (!member) return;

      const config = await report_model.findOne({
        GuildID: interaction.guild?.id,
      });

      if (!config) {
        return await interaction.reply({
          embeds: [
            {
              title: '通報機能がこのサーバーでは有効化されていません',
              description: 'サーバー管理者にお問い合わせください',
              color: Colors.Red,
              footer: footer(),
            },
          ],
          ephemeral: true,
        });
      } else {
        const channel = interaction.guild?.channels.cache.get(config.ChannelID);

        if (!channel || channel.type !== ChannelType.GuildText) {
          return await interaction.reply({
            embeds: [
              {
                title: '通報機能がこのサーバーでは有効化されていません',
                description: 'サーバー管理者にお問い合わせください',
                color: Colors.Red,
                footer: footer(),
              },
            ],
            ephemeral: true,
          });
        }

        await interaction.reply({
          embeds: [
            {
              author: {
                name: `${member.user.tag}のメッセージが通報されました`,
                icon_url: member.user.displayAvatarURL().toString(),
              },
              description:
                `${member.user}のメッセージを${interaction.user}が通報しました\n` +
                `**${Member} メンバー:** ${member.user.tag} **[${member.user.id}]**\n` +
                `**${Space} 作成日:** <t:${member.user.createdTimestamp}>`,
              fields: [
                {
                  name: '通報されたメッセージ',
                  value: message.content,
                },
              ],
              footer: {
                text: `Reported by ${interaction.user.tag}`,
              },
            },
          ],
          ephemeral: true,
        });

        await channel.send({
          embeds: [
            {
              author: {
                name: `${member.user.tag}のメッセージが通報されました`,
                icon_url: member.user.displayAvatarURL().toString(),
              },
              description:
                `${member.user}のメッセージを${interaction.user}が通報しました\n` +
                `**${Member} メンバー:** ${member.user.tag} **[${member.user.id}]**\n` +
                `**${Space} 作成日:** <t:${member.user.createdTimestamp}>`,
              fields: [
                {
                  name: '通報されたメッセージ',
                  value: message.content,
                },
              ],
              footer: {
                text: `Reported by ${interaction.user.tag}`,
              },
            },
          ],
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.Button,
                  label: 'メッセージを確認',
                  style: ButtonStyle.Link,
                  url: message.url,
                },
                {
                  type: ComponentType.Button,
                  label: 'メッセージを削除',
                  style: ButtonStyle.Success,
                  customId: `delete_message-${message.channel.id}-${message.id}`,
                },
                {
                  type: ComponentType.Button,
                  label: '通報を無視',
                  style: ButtonStyle.Danger,
                  customId: `dismiss_report`,
                },
              ],
            },
          ],
        });
      }
    },
  },
});
