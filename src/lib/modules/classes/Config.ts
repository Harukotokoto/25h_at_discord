import { client } from '../../../index';
import { Guild } from 'discord.js';
import {
  leveling_model,
  publish_model,
  report_model,
} from '../../models/config';

type config = 'publish' | 'report' | 'leveling';

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

  public async setLeveling(state?: boolean) {
    if (state) {
      const leveling = await leveling_model.findOne({
        GuildID: this.guild.id,
      });

      if (!leveling) {
        await leveling_model.create({
          GuildID: this.guild.id,
        });
      }
    } else {
      await leveling_model.deleteMany({
        GuildID: this.guild.id,
      });
    }
  }

  public async getEnable(config: config, channelId?: string) {
    if (!channelId) throw new Error('チャンネルIDを指定してください');

    switch (config) {
      case 'publish':
        return !!(await publish_model.findOne({
          GuildID: this.guild.id,
          ChannelID: channelId,
        }));
      case 'report':
        return !!(await report_model.findOne({
          GuildID: this.guild.id,
          ChannelID: channelId,
        }));
      case 'leveling':
        return !!(await leveling_model.findOne({
          GuildID: this.guild.id,
        }));
      default:
        return false;
    }
  }

  public async getConfig() {
    const publish = await publish_model.find({
      GuildID: this.guild.id,
    });

    const report = await report_model.find({
      GuildID: this.guild.id,
    });

    const leveling = await leveling_model.find({
      GuildID: this.guild.id,
    });

    return {
      publish: publish || null,
      report: report || null,
      leveling: leveling || null,
    };
  }
}
