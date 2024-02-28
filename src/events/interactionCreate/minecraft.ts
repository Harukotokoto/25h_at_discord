import { Event } from '../../lib/modules/Event';
import {
  ButtonStyle,
  ChannelType,
  Colors,
  ComponentType,
  GuildMember,
  TextInputStyle,
} from 'discord.js';
import { footer } from '../../lib/utils/embed';
import { client } from '../../index';

export default new Event('interactionCreate', async (interaction) => {
  if (!interaction.guild) return;
  if (interaction.isButton()) {
    if (interaction.customId === 'ktrndsmc_verify') {
      if (
        (interaction.member as GuildMember).roles.cache.has(
          '1211617202177052672'
        )
      ) {
        await interaction.reply({
          embeds: [
            {
              description: '既に認証されています',
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
            title: '認証申請',
            description:
              '※認証した時点で利用規約に同意したものとみなします\n' +
              '※認証後は、サーバーのルールを守ってプレイしてください' +
              '※認証完了まで少々お時間を頂きます。',
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
                style: ButtonStyle.Success,
                label: '認証手続きを始める',
                customId: 'ktrndsmc_send',
              },
            ],
          },
        ],
        ephemeral: true,
      });
    } else if (interaction.customId === 'ktrndsmc_send') {
      await interaction.showModal({
        title: '認証申請を送信',
        customId: 'ktrndsmc_request',
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.TextInput,
                placeholder: 'ユーザー名/ゲーマータグ',
                label: 'マイクラのユーザー名(ホワイトリストに追加します)',
                style: TextInputStyle.Short,
                customId: 'request_username',
              },
            ],
          },
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.TextInput,
                placeholder: 'Java版 or 統合版',
                label: 'プラットフォーム',
                style: TextInputStyle.Short,
                customId: 'request_platform',
              },
            ],
          },
        ],
      });
    } else if (interaction.customId.startsWith('ktrndsmc_agree')) {
      const memberId = interaction.customId.split('-')[1];
      const member = interaction.guild?.members.cache.get(memberId);
      if (!member) {
        return await interaction.reply({
          embeds: [
            {
              description: 'ユーザーが見つかりませんでした',
              color: Colors.Red,
              footer: footer(),
            },
          ],
        });
      }

      await member.roles.add('1211617202177052672');

      await member.send({
        embeds: [
          {
            title: '認証完了',
            description:
              'マイクラサーバーの認証申請が承諾されました。\n' +
              '[参加方法](<https://discord.com/channels/1149350818747781120/1211614876443873320>)の手順に沿って参加してください。',
            color: Colors.Green,
            footer: footer(),
            author: {
              name: interaction.guild.name,
              icon_url: interaction.guild.iconURL() as string,
            },
          },
        ],
      });

      await interaction.update({
        embeds: [
          {
            title: '受諾済みの認証申請',
            description: interaction.message.embeds[0].description as string,
            color: Colors.Green,
            footer: footer(),
          },
        ],
        components: [],
      });
    } else if (interaction.customId === 'ktrndsmc_disagree') {
      await interaction.update({
        embeds: [
          {
            title: '認証申請を破棄しました',
            description: interaction.message.embeds[0].description as string,
            color: Colors.Red,
            footer: footer(),
          },
        ],
        components: [],
      });
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'ktrndsmc_request') {
      const username = interaction.fields.getTextInputValue('request_username');
      const platform = interaction.fields.getTextInputValue('request_platform');

      await interaction.reply({
        embeds: [
          {
            title: '認証申請を送信しました',
            description:
              `ゲーム内ID: \`${username}\`\n` +
              `プラットフォーム: \`${platform}\`\n` +
              '\n' +
              '認証完了まで少々お待ちください\n' +
              '認証完了後、DMで通知します',
            color: Colors.Green,
            footer: footer(),
          },
        ],
        ephemeral: true,
      });

      const channel = client.channels.cache.get('1211621370010665052');
      if (!channel || channel.type !== ChannelType.GuildText) return;

      await channel.send({
        embeds: [
          {
            title: '認証申請を受諾しました',
            description:
              `ユーザー: ${interaction.user.tag}\n` +
              `ゲーム内ID: ${username}\n` +
              `プラットフォーム: ${platform}\n`,
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
                style: ButtonStyle.Success,
                label: '承諾',
                customId: `ktrndsmc_agree-${interaction.user.id}`,
              },
              {
                type: ComponentType.Button,
                style: ButtonStyle.Danger,
                label: '破棄',
                customId: `ktrndsmc_disagree`,
              },
            ],
          },
        ],
      });
    }
  }
});
