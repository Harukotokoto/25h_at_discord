import { Command } from '../../lib/modules/Command';
import { ButtonStyle, Colors, ComponentType } from 'discord.js';
import { footer } from '../../lib/utils/embed';

export default new Command({
  name: 'msg',
  description: 'メッセージを送信します',
  execute: {
    message: async ({ client, message, args }) => {
      if (message.guild?.id !== '1149350818747781120') return;
      if (message.author.id !== '1004365048887660655') return;

      if (args[0] === 'rule') {
        message.channel.send({
          embeds: [
            {
              title: 'マイクラサーバー利用規約',
              description:
                '語るんです！マイクラサーバーを利用するにあたっての利用規約です。\n' +
                '認証を完了した時点で、以下の利用規約に同意したものとみなします。',
              fields: [
                {
                  name: '第1条（禁止事項）',
                  value:
                    '1. 他人の物資を無断で漁る行為\n' +
                    '2. 他人の建築物を破壊する行為\n' +
                    '3. サーバーに意図的に負荷をかける行為\n' +
                    '4. 他人の迷惑になる行為\n' +
                    '5. ハッククライアント等を使用した不正行為\n' +
                    '- X-rayテクスチャパック、ESP Modも含みます' +
                    '6. その他、サーバーの運営に迷惑をかける行為',
                },
                {
                  name: '第2条（罰則）',
                  value:
                    '1. 禁止事項に違反した場合、運営の判断で処罰を行います\n' +
                    '2. 処罰には、BAN、TempBAN、Mute、TempMute、Kickが含まれます\n',
                },
                {
                  name: '第3条（その他）',
                  value:
                    '1. この利用規約は予告なく変更されることがあります\n' +
                    '2. その他、運営が必要と判断した場合、処罰を行います',
                },
                {
                  name: '第4条（同意）',
                  value:
                    '1. 認証を完了した時点で、この利用規約に同意したものとみなします',
                },
              ],
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
                  label: '認証',
                  style: ButtonStyle.Secondary,
                  emoji: '✅',
                  customId: 'ktrndsmc_verify',
                },
              ],
            },
          ],
        });
      }

      if (args[0] === 'join') {
        message.channel.send({
          embeds: [
            {
              title: '参加方法',
              description:
                '語るんです！マイクラサーバーに参加するには、以下の手順を踏んでください',
              fields: [
                {
                  name: 'Java Editionの場合',
                  value:
                    '1. サーバーアドレスに、`mc.ktrnds.com`と入力\n' +
                    '2. 接続する\n',
                },
                {
                  name: 'Bedrock Edition(統合版)の場合',
                  value:
                    '1. サーバーアドレスに、`mc.ktrnds.com`と入力\n' +
                    '2. ポート番号に、`19132`と入力\n' +
                    '3. 接続する\n' +
                    '\n' +
                    'Nintendo Switchの統合版の場合は以下の動画をご覧下さい。\n' +
                    '> [【マイクラ統合版】スイッチ版でスマホやPCの外部サーバーを追加する方法！【Switch/スイッチ】ver1.16]' +
                    '(<https://www.youtube.com/watch?v=bZWHDhKoqnc>)',
                },
                {
                  name: 'バージョンについて',
                  value:
                    'サーバーはSpigot 1.20.4を使用しています。\n' +
                    '参加可能バージョンは以下の通りです。\n' +
                    '**Java Edition: **1.8.x ~ 最新バージョン\n' +
                    '**Bedrock Edition: **1.16.x ~ 最新バージョン' +
                    '\n' +
                    '私はアホなので定期的に更新を忘れます。その際は運営にお知らせください。',
                },
              ],
              color: Colors.Blue,
              footer: footer(),
            },
          ],
        });
      }
    },
  },
});
