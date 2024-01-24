import {
  Channel,
  ChannelType,
  Collection,
  GuildChannelResolvable,
} from 'discord.js';
import { client } from '../../index';
import moment, { min } from 'moment';
import osu from 'node-os-utils';

export enum UpdateType {
  Status,
  WebSocket,
  Uptime,
  RAM,
  CPU,
  Version,
}

const channels: Collection<UpdateType, string> = new Collection<
  UpdateType,
  string
>();

export class StatusUpdater {
  public format;

  public async setUpdater(channel: Channel | string, type: UpdateType) {
    if (typeof channel === 'string') {
      channels.set(type, channel);
    } else {
      channels.set(type, channel.id);
    }
  }

  public async update() {
    const status = channels.get(UpdateType.Status);
    const ws_status = channels.get(UpdateType.WebSocket);
    const uptime_status = channels.get(UpdateType.Uptime);
    const ram_status = channels.get(UpdateType.RAM);
    const cpu_status = channels.get(UpdateType.CPU);
    const version_status = channels.get(UpdateType.Version);

    const status_channel = client.channels.cache.get(status || '');
    const ws_status_channel = client.channels.cache.get(ws_status || '');
    const uptime_status_channel = client.channels.cache.get(
      uptime_status || ''
    );
    const ram_status_channel = client.channels.cache.get(ram_status || '');
    const cpu_status_channel = client.channels.cache.get(cpu_status || '');
    const version_status_channel = client.channels.cache.get(
      version_status || ''
    );

    if (
      status_channel &&
      status_channel.type === (ChannelType.GuildText || ChannelType.GuildVoice)
    ) {
      status_channel.setName(`🟢：Status: Online`);
    }

    if (
      ws_status_channel &&
      ws_status_channel.type ===
      (ChannelType.GuildText || ChannelType.GuildVoice)
    ) {
      ws_status_channel.setName(
        this.format.replace('[state]', `WebSocket: ${client.ws.ping}`)
      );
    }

    if (
      uptime_status_channel &&
      uptime_status_channel.type ===
      (ChannelType.GuildText || ChannelType.GuildVoice)
    ) {
      const start_time = client.start_time;
      const now = moment();
      const uptime = moment.duration(now.diff(start_time));

      const days = Math.floor(uptime.asDays()).toString().padStart(2, '0');
      const hours = uptime.hours().toString().padStart(2, '0');
      const minutes = uptime.minutes().toString().padStart(2, '0');

      const formatted_uptime = `${days}:${hours}:${minutes}`;

      uptime_status_channel.setName(
        this.format.replace('[state]', `Uptime: ${formatted_uptime}`)
      );
    }

    if (
      ram_status_channel &&
      ram_status_channel.type ===
      (ChannelType.GuildText || ChannelType.GuildVoice)
    ) {
      const memUsage = (await osu.mem.info()).usedMemPercentage;
      const memInteger = Math.round(memUsage);

      ram_status_channel.setName(
        this.format.replace('[state]', `RAM: ${memInteger}%`)
      );
    }

    if (
      cpu_status_channel &&
      cpu_status_channel.type ===
      (ChannelType.GuildText || ChannelType.GuildVoice)
    ) {
      const cpuUsage = await osu.cpu.usage();
      const cpuInteger = Math.round(cpuUsage);

      cpu_status_channel.setName(
        this.format.replace('[state]', `CPU: ${cpuInteger}%`)
      );
    }

    if (
      version_status_channel &&
      version_status_channel.type ===
      (ChannelType.GuildText || ChannelType.GuildVoice)
    ) {
      const version = process.version;

      version_status_channel.setName(
        this.format.replace('[state]', `Version: ${version_status}`)
      );
    }
  }

  public constructor(format: string) {
    this.format = format;
  }
}
