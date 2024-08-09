import { ticket_setup_model } from '../../models/ticket_setup';
import {
  ButtonInteraction,
  ButtonStyle,
  ChannelType,
  Colors,
  ComponentType,
  ModalSubmitInteraction,
  OverwriteType,
  PermissionsBitField,
} from 'discord.js';
import { randomUUID } from 'node:crypto';
import { footer } from '../../utils/embed';

class Ticket {
  constructor() {}

  public async setup(messageId: string, categoryId: string, staffId: string) {
    return await ticket_setup_model.create({
      MessageID: messageId,
      Category: categoryId,
      TicketID: randomUUID(),
      StaffRoleID: staffId,
    });
  }

  public async create(interaction: ModalSubmitInteraction) {
    if (!interaction.guild) {
      return false;
    }

    const topic = interaction.fields.getTextInputValue('topic');
    const issue = interaction.fields.getTextInputValue('issue');

    const messageId = interaction.customId.split(/-/g)[1];

    const ticket = await ticket_setup_model.findOne({
      MessageID: messageId,
    });
    if (!ticket) {
      return false;
    }

    const staff_role = interaction.guild.roles.cache.get(ticket.StaffRoleID);
    if (!staff_role) {
      return false;
    }

    const channel = await interaction.guild.channels.create({
      name: `${interaction.user.username}-ticket`,
      type: ChannelType.GuildText,
      parent: ticket.Category,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: staff_role.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });

    await channel.send({
      content: `${staff_role.toString()}`,
      embeds: [
        {
          title: 'チケットを作成しました',
          description:
            '```\nチケットを作成しました\nスタッフの対応までお待ちください\n```',
          fields: [
            {
              name: '発行者',
              value: interaction.user.toString(),
            },
            {
              name: 'タイトル',
              value: topic,
            },
            {
              name: '問題',
              value: issue,
            },
          ],
          footer: footer(),
          color: Colors.Blue,
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: 'チケットを閉じる',
              customId: 'ticket_close',
              style: ButtonStyle.Secondary,
            },
          ],
        },
      ],
      allowedMentions: {
        parse: ['roles'],
      },
    });

    return channel.id;
  }

  public async close(interaction: ButtonInteraction) {
    if (!interaction.channel || !interaction.guild) return;

    const channel = await interaction.guild.channels.fetch(
      interaction.channel.id
    );
    if (!channel) return;
    if (channel.type !== ChannelType.GuildText) return;

    const channelPermissions = channel.permissionOverwrites.cache.map(
      (permission) => permission
    );

    for (const permission of channelPermissions) {
      if (permission.type === OverwriteType.Role) continue;

      await permission.edit({
        ViewChannel: false,
      });
    }

    await interaction.channel.send({
      embeds: [
        {
          title: 'チケットを閉じました',
          color: Colors.Grey,
          footer: footer(),
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: '再度開く',
              customId: 'reopen-ticket',
              style: ButtonStyle.Secondary,
            },
            {
              type: ComponentType.Button,
              label: 'ログを書き出し',
              customId: 'write-logs',
              style: ButtonStyle.Primary,
            },
            {
              type: ComponentType.Button,
              label: 'チケットを削除',
              customId: 'delete-ticket',
              style: ButtonStyle.Danger,
            },
          ],
        },
      ],
    });
  }

  public async reopen(interaction: ButtonInteraction) {
    if (!interaction.channel || !interaction.guild) return;

    const channel = await interaction.guild.channels.fetch(
      interaction.channel.id
    );
    if (!channel) return;
    if (channel.type !== ChannelType.GuildText) return;

    const channelPermissions = channel.permissionOverwrites.cache.map(
      (permission) => permission
    );

    for (const permission of channelPermissions) {
      if (permission.type === OverwriteType.Role) continue;

      await permission.edit({
        ViewChannel: true,
      });
    }

    await interaction.message.delete();

    await interaction.channel.send({
      embeds: [
        {
          title: 'チケットを再度開きました',
          footer: footer(),
          color: Colors.Blue,
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: 'チケットを閉じる',
              customId: 'ticket_close',
              style: ButtonStyle.Secondary,
            },
          ],
        },
      ],
      allowedMentions: {
        parse: [],
      },
    });
  }

  public async writeLogs(interaction: ButtonInteraction) {
    if (!interaction.channel || !interaction.guild) return;
    const messages = await interaction.channel.messages.fetch();

    const buffer = Buffer.from(
      messages
        .map((message) => {
          if (!message.content && !message.attachments) return;
          if (!message.content && message.attachments) {
            return message.attachments
              .map((attachment) => {
                return `<${message.author.tag}> ${attachment.url}`;
              })
              .join('\n');
          }

          if (message.content && message.attachments) {
            const attachmentList = message.attachments
              .map((attachment) => {
                return `<${message.author.tag}> ${attachment.url}`;
              })
              .join('\n');
            const contentList = `<${message.author.tag}> ${message.content}`;

            return attachmentList + '\n' + contentList;
          }

          if (message.content && !message.attachments) {
            return `<${message.author.tag}> ${message.content}`;
          }
        })
        .join('\n'),
      'utf-8'
    );

    await interaction.channel.send({
      embeds: [
        {
          description:
            '過去100メッセージのログをテキストファイルとして書き出しました',
          color: Colors.Grey,
          footer: footer(),
        },
      ],
      files: [
        {
          attachment: buffer,
          name: 'output.txt',
          description: `Saved ticket channel(${interaction.channel.id}) logs.`,
        },
      ],
    });

    await interaction.message.edit({
      embeds: [
        {
          title: 'チケットを閉じました',
          color: Colors.Grey,
          footer: footer(),
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              label: '再度開く',
              customId: 'reopen-ticket',
              style: ButtonStyle.Secondary,
            },
            {
              type: ComponentType.Button,
              label: 'ログを書き出し',
              customId: 'write-logs',
              style: ButtonStyle.Primary,
            },
            {
              type: ComponentType.Button,
              label: 'チケットを削除',
              customId: 'delete-ticket',
              style: ButtonStyle.Danger,
            },
          ],
        },
      ],
    });
  }

  public async deleteChannel(interaction: ButtonInteraction) {
    await interaction.message.delete();
    await interaction.channel?.send({
      embeds: [
        {
          description: '5秒後にチケットを削除します',
          color: Colors.Red,
          footer: footer(),
        },
      ],
    });

    setTimeout(async () => {
      await interaction.channel?.delete();
    }, 5000);
  }
}

export { Ticket };
