import { ButtonStyle, Colors, ComponentType } from 'discord.js';
import { Command } from '../../lib/modules/Command';
import { footer } from '../../lib/utils/Embed';

export default new Command({
  name: 'request',
  description: 'request',
  private: true,
  isOwnerCommand: true,
  execute: {
    message: async ({ client, message, args }) => {
      message.channel.send({
        embeds: [
          {
            title: 'Feedback',
            description:
              'たっくん鯖Bot(<@!1130241096396578978>)に追加してほしい機能、感想等ありましたら気軽に評価お願いします！' +
              '\n\n' +
              '> 1. `フィードバックを送信`と書いてあるボタンを押す。' +
              '\n' +
              '> 2. 内容を入力して送信!' +
              '\n' +
              '> 3. あとはこちら側で確認させていただきます！' +
              '\n\n' +
              '快適なBot制作のお手伝いをよろしくお願いします。' +
              '\n' +
              'コマンド名わからないけどこんな機能欲しい！というリクエストでも大丈夫です！',
            color: Colors.Gold,
            image: {
              url: 'https://cdn.discordapp.com/attachments/1112252949595422730/1194935137658482790/BqNrgE1.png',
            },
            footer: footer(),
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.Button,
                label: 'フィードバックを送信',
                style: ButtonStyle.Secondary,
                customId: 'feedback-send',
                emoji: '📩',
              },
            ],
          },
        ],
      });
    },
  },
});
