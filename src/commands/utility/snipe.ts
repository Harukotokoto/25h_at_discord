import { Command } from '../../lib/modules/Command';
import {
  APIEmbed,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Colors,
} from 'discord.js';
import { footer } from '../../lib/utils/Embed';

export default new Command({
  name: 'snipe',
  description:
    '編集/削除されたメッセージを取得し、表示します。パラメーターに"e"を含むと編集したメッセージを表示します',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'snipe_type',
      description: 'Snipe Type',
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: 'Delete', value: 'd' },
        { name: 'Edit', value: 'e' },
      ],
    },
  ],
  aliases: ['s'],
  execute: {
    interaction: async ({ client, interaction }) => {
      if (!interaction.isChatInputCommand()) return;
      const args = interaction.options.getString('snipe_type');
      const argument = args ? 'e' : 'd';

      if (!interaction.channel) return;

      if (argument !== 'e') {
        const sniped_message = client.snipes.get(interaction.channel.id);
        if (!sniped_message) {
          return await interaction.followUp({
            embeds: [
              {
                description: 'スナイプするメッセージがありません',
                color: Colors.Red,
                footer: footer(),
              },
            ],
            allowedMentions: {
              parse: [],
            },
          });
        }

        const attachments = sniped_message.attachments.size
          ? sniped_message.attachments.map((attachment) => attachment.proxyURL)
          : undefined;

        const embeds: APIEmbed[] = [
          {
            author: {
              name: `${
                sniped_message.author?.displayName || ''
              }(${sniped_message.author?.tag})`,
              icon_url: sniped_message.author?.avatarURL()?.toString() || '',
            },
            description: `${sniped_message.content}`,
            timestamp: new Date(sniped_message.createdTimestamp).toISOString(),
            color: Colors.Aqua,
          },
        ];

        attachments?.forEach((attachment) => {
          embeds.push({
            image: {
              url: attachment,
            },
            color: Colors.Aqua,
          });
        });

        return await interaction.followUp({
          embeds: embeds,
          allowedMentions: {
            parse: [],
          },
        });
      } else {
        const snipe = client.edit_snipes.get(interaction.channel.id);
        if (!snipe) {
          return await interaction.reply({
            embeds: [
              {
                description: 'スナイプするメッセージがありません',
                color: Colors.Red,
                footer: footer(),
              },
            ],
            allowedMentions: {
              parse: [],
            },
          });
        }

        return await interaction.followUp({
          embeds: [
            {
              author: {
                name: `${snipe.newMessage.author?.displayName || ''}(${
                  snipe.newMessage.author?.tag
                })`,
                icon_url:
                  snipe.newMessage.author?.avatarURL()?.toString() || '',
              },
              description: `${snipe.oldMessage.content} => ${snipe.newMessage.content}`,
              timestamp: new Date(
                snipe.newMessage.createdTimestamp
              ).toISOString(),
              color: Colors.Yellow,
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });
      }
    },
    message: async ({ client, message, args }) => {
      const argument = args[0] ? (args[0] === 'e' ? 'e' : 'd') : 'd';

      if (argument !== 'e') {
        const sniped_message = client.snipes.get(message.channel.id);
        if (!sniped_message) {
          return await message.reply({
            embeds: [
              {
                description: 'スナイプするメッセージがありません',
                color: Colors.Red,
                footer: footer(),
              },
            ],
            allowedMentions: {
              parse: [],
            },
          });
        }

        const attachments = sniped_message.attachments.size
          ? sniped_message.attachments.map((attachment) => attachment.proxyURL)
          : undefined;

        const embeds: APIEmbed[] = [
          {
            author: {
              name: `${
                sniped_message.author?.displayName || ''
              }(${sniped_message.author?.tag})`,
              icon_url: sniped_message.author?.avatarURL()?.toString() || '',
            },
            description: `${sniped_message.content}`,
            timestamp: new Date(sniped_message.createdTimestamp).toISOString(),
            color: Colors.Aqua,
          },
        ];

        attachments?.forEach((attachment) => {
          embeds.push({
            image: {
              url: attachment,
            },
            color: Colors.Aqua,
          });
        });

        return await message.reply({
          embeds: embeds,
          allowedMentions: {
            parse: [],
          },
        });
      } else {
        const snipe = client.edit_snipes.get(message.channel.id);
        if (!snipe) {
          return await message.reply({
            embeds: [
              {
                description: 'スナイプするメッセージがありません',
                color: Colors.Red,
                footer: footer(),
              },
            ],
            allowedMentions: {
              parse: [],
            },
          });
        }
        return await message.reply({
          embeds: [
            {
              author: {
                name: `${snipe.newMessage.author?.displayName || ''}(${
                  snipe.newMessage.author?.tag
                })`,
                icon_url:
                  snipe.newMessage.author?.avatarURL()?.toString() || '',
              },
              description: `${snipe.oldMessage.content} => ${snipe.newMessage.content}`,
              timestamp: new Date(
                snipe.newMessage.createdTimestamp
              ).toISOString(),
              color: Colors.Yellow,
            },
          ],
          allowedMentions: {
            parse: [],
          },
        });
      }
    },
  },
});
