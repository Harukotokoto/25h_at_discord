import { client } from '../../../index';
import { Guild } from 'discord.js';
import {
  report_model,
  leveling_model,
  publish_model,
} from '../../models/config';

export class Config {
  protected guild: Guild;

  constructor(guildId: string) {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) throw new Error('指定されたギルドIDは無効です');

    this.guild = guild;
    return this;
  }

  public async setPublish(channelId?: string) {
    if (channelId) {
      const channel = client.channels.cache.get(channelId);
      if (!channel) throw new Error('指定されたチャンネルIDは無効です');

      const publish = await publish_model.findOne({
        GuildID: this.guild.id,
        ChannelID: channel.id,
      });

      if (!publish) {
        await publish_model.create({
          GuildID: this.guild.id,
          ChannelID: channel.id,
        });
      }
    } else {
      await publish_model.deleteMany({
        GuildID: this.guild.id,
      });
    }
  }

  public async setReport(channelId?: string) {
    if (channelId) {
      const channel = client.channels.cache.get(channelId);
      if (!channel) throw new Error('指定されたチャンネルIDは無効です');

      const report = await report_model.findOne({
        GuildID: this.guild.id,
        ChannelID: channel.id,
      });

      if (!report) {
        await report_model.create({
          GuildID: this.guild.id,
          ChannelID: channel.id,
        });
      }
    } else {
      await report_model.deleteMany({
        GuildID: this.guild.id,
      });
    }
  }
}
