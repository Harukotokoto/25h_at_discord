import {
  APIEmbed,
  APIEmbedFooter,
  ChannelType,
  Colors,
  Guild,
  TextChannel,
} from 'discord.js';
import { client } from '../../index';
import osu from 'node-os-utils';
import {
  Boost,
  Channel,
  Journey,
  Lock,
  Member,
  Online,
  Protected,
  RAM_Bad,
  RAM_Excellent,
  RAM_Good,
  Server,
  Space,
  Stage,
  Stats01,
  Stats02,
  Stats03,
  Voice,
} from './emojis';
import { createBar } from './createBar';

const footer = (): APIEmbedFooter => {
  const user = client.users.cache.get('1004365048887660655');
  return {
    text: `Developed by はること`,
    icon_url: user?.avatarURL() as string,
  };
};

const pingEmbed = async (response: number) => {
  // WSの速度を計算
  const ping = client.ws.ping;

  // CPU使用率を計算
  const cpuUsage = await osu.cpu.usage();
  // RAM使用率を計算
  const memUsage = (await osu.mem.info()).usedMemPercentage;

  // 整数にする
  const cpuInteger = Math.round(cpuUsage);
  const memInteger = Math.round(memUsage);

  // CPUの使用率に応じて絵文字を変更
  const cpuEmoji =
    cpuInteger < 30 ? RAM_Excellent : cpuInteger <= 60 ? RAM_Good : RAM_Bad;

  // RAMの使用率に応じて絵文字を変更
  const memEmoji =
    memInteger < 50 ? RAM_Excellent : memInteger <= 80 ? RAM_Good : RAM_Bad;

  // レスポンス速度に応じて絵文字を変更_
  const responseEmoji =
    response < 401 ? Stats01 : response <= 600 ? Stats02 : Stats03;

  // WS速度に応じて絵文字を変更
  const latencyEmoji = ping < 201 ? Stats01 : ping <= 400 ? Stats02 : Stats03;

  // フィールドを作成
  const latencyMessage =
    Space + latencyEmoji + '**WebSocket:** `' + ping + '`ms';
  const responseMessage =
    Space + responseEmoji + '**Response:** `' + response + '`ms';

  const cpuMessage = cpuEmoji + ' **CPU:** `' + cpuUsage + '`%';
  const memMessage = memEmoji + ' **RAM:** `' + memUsage + '`%';

  const resourceFieldMessage = Space + Journey + ' **Resources:**';

  const resourceField =
    Space + Space + cpuMessage + '\n' + Space + Space + memMessage;

  const title = Stage + ' **Shard[0]:**';

  return {
    embeds: [
      {
        title: Online + ' Bot Status:',
        fields: [
          {
            name: title,
            value:
              latencyMessage +
              '\n' +
              responseMessage +
              '\n' +
              resourceFieldMessage +
              '\n' +
              resourceField,
          },
        ],
        color: Colors.Aqua,
        footer: footer(),
      },
    ],
  };
};

export const serverInfo = async (guild: Guild): Promise<APIEmbed> => {
  const verification_levels = {
    0: '無し',
    1: '低',
    2: '中',
    3: '高',
    4: '最高',
  };

  const createBoostBar = () => {
    const boostCount = guild.premiumSubscriptionCount ?? 0;
    const boostLevel = guild.premiumTier;

    switch (boostLevel) {
      case 0:
        return (
          `レベル無し | ${boostCount === 0 ? '未' : boostCount}ブースト\n` +
          createBar(boostCount, 2) +
          `\n次のレベルまで: ${boostCount}/2`
        );
      case 1:
        return (
          `レベル ${boostLevel} | ${boostCount}ブースト\n` +
          createBar(boostCount, 7) +
          `\n次のレベルまで: ${boostCount}/7`
        );
      case 2:
        return (
          `レベル ${boostLevel} | ${boostCount}ブースト\n` +
          createBar(boostCount, 14) +
          `\n次のレベルまで: ${boostCount}/14`
        );
      case 3:
        return (
          `レベル ${boostLevel} | ${boostCount}ブースト\n` +
          createBar(14, 14) +
          '\nブーストレベル最大🎉'
        );
    }
  };

  return {
    author: {
      name: guild.name,
      icon_url: guild.iconURL()?.toString(),
    },
    image: {
      url: guild.bannerURL()?.toString() || '',
    },
    fields: [
      {
        name: Server + ' サーバー作成日',
        value: '<t:' + Math.round(guild.createdAt.getTime() / 1000) + '>',
        inline: true,
      },
      {
        name: Member + ' サーバー所有者',
        value: '<@!' + (await guild.fetchOwner()).id + '>',
      },
      {
        name: Member + ' メンバー数',
        value: guild.memberCount + '人',
        inline: true,
      },
      {
        name: Lock + ' BANされたユーザー数',
        value: (await guild.bans.fetch()).size.toString() + 'メンバー',
        inline: true,
      },
      {
        name: Protected + ' 認証レベル',
        value: verification_levels[guild.mfaLevel],
        inline: true,
      },
      {
        name: Boost + ' サーバーブースト進行度',
        value: createBoostBar() ?? '生成中にエラーが発生しました',
      },
      {
        name: 'チャンネル数(' + guild.channels.cache.size + ')',
        value:
          Channel +
          ' **テキストチャンネル:** ' +
          guild.channels.cache.filter((channel) => channel.isTextBased).size +
          '\n' +
          Voice +
          ' **ボイスチャンネル:** ' +
          guild.channels.cache.filter((channel) => channel.isVoiceBased()).size,
      },
    ],
    color: Colors.Gold,
    footer: footer(),
  };
};

export { footer, pingEmbed };
